import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'
import { decodeAppleJWS, decodeJWSPayload } from '@/lib/apple/jwt-validator'
import {
  AppleNotificationRequest,
  DecodedNotificationPayload,
  JWSTransactionDecodedPayload,
  JWSRenewalInfoDecodedPayload,
  NotificationType,
  NotificationSubType,
} from '@/lib/apple/notification-types'
import { FieldValue } from 'firebase-admin/firestore'

// Resolve device ID from transaction info
async function resolveDeviceId(
  db: FirebaseFirestore.Firestore,
  transactionInfo: JWSTransactionDecodedPayload
): Promise<string | null> {
  // 1. Check appAccountToken (set during purchase — available after app update)
  if (transactionInfo.appAccountToken) {
    return transactionInfo.appAccountToken
  }

  // 2. Check transaction_map collection
  const txnDoc = await db
    .collection('transaction_map')
    .doc(transactionInfo.originalTransactionId)
    .get()

  if (txnDoc.exists) {
    return txnDoc.data()?.deviceId || null
  }

  // 3. Query users collection for matching product/subscription data
  // Search for users who have this product's subscription
  const usersSnapshot = await db
    .collection('users')
    .where('is_subscribed', '==', true)
    .limit(100)
    .get()

  // Can't reliably match without more data — store for manual review
  return null
}

// Process the notification and update Firestore
async function processNotification(
  db: FirebaseFirestore.Firestore,
  notification: DecodedNotificationPayload,
  transactionInfo: JWSTransactionDecodedPayload | null,
  renewalInfo: JWSRenewalInfoDecodedPayload | null,
  deviceId: string | null
) {
  const { notificationType, subtype } = notification

  // Always log the event
  const eventDoc: Record<string, unknown> = {
    notificationType,
    subtype: subtype || null,
    notificationUUID: notification.notificationUUID,
    environment: notification.data.environment,
    originalTransactionId: transactionInfo?.originalTransactionId || null,
    productId: transactionInfo?.productId || null,
    deviceId,
    processedAt: FieldValue.serverTimestamp(),
    signedDate: notification.signedDate,
  }

  if (transactionInfo?.expiresDate) {
    eventDoc.expiresDate = new Date(transactionInfo.expiresDate)
  }
  if (transactionInfo?.purchaseDate) {
    eventDoc.purchaseDate = new Date(transactionInfo.purchaseDate)
  }
  if (renewalInfo) {
    eventDoc.autoRenewStatus = renewalInfo.autoRenewStatus
    eventDoc.isInBillingRetryPeriod = renewalInfo.isInBillingRetryPeriod || false
  }

  // Write to subscription_events collection
  await db.collection('subscription_events').add(eventDoc)

  // If we can't resolve the device ID, store in unmatched for manual review
  if (!deviceId) {
    await db.collection('unmatched_subscription_events').add({
      ...eventDoc,
      reason: 'Could not resolve device ID',
    })
    return
  }

  // Update user document based on notification type
  const userRef = db.collection('users').doc(deviceId)
  const updates: Record<string, unknown> = {
    subscription_last_event: notificationType,
    subscription_last_event_at: FieldValue.serverTimestamp(),
  }

  switch (notificationType) {
    case NotificationType.SUBSCRIBED:
      updates.is_subscribed = true
      updates.subscription_status = 'active'
      if (transactionInfo?.expiresDate) {
        updates.subscription_expires_date = new Date(transactionInfo.expiresDate)
      }
      if (transactionInfo?.productId) {
        updates.subscription_product_id = transactionInfo.productId
      }
      if (subtype === NotificationSubType.INITIAL_BUY) {
        updates.subscription_started_at = FieldValue.serverTimestamp()
        // Check if this is a trial (expiresDate close to purchaseDate typically means trial)
        if (transactionInfo?.expiresDate && transactionInfo?.purchaseDate) {
          const durationMs = transactionInfo.expiresDate - transactionInfo.purchaseDate
          const durationDays = durationMs / (1000 * 60 * 60 * 24)
          if (durationDays <= 7) {
            updates.is_trial = true
            updates.trial_end_date = new Date(transactionInfo.expiresDate)
          }
        }
      } else if (subtype === NotificationSubType.RESUBSCRIBE) {
        updates.resubscribed_at = FieldValue.serverTimestamp()
        updates.was_previously_premium = true // They're re-subscribing
        updates.is_in_billing_retry = false
      }
      break

    case NotificationType.DID_RENEW:
      updates.is_subscribed = true
      updates.is_in_billing_retry = false
      updates.subscription_status = 'active'
      updates.subscription_renewed_at = FieldValue.serverTimestamp()
      if (transactionInfo?.expiresDate) {
        updates.subscription_expires_date = new Date(transactionInfo.expiresDate)
      }
      // If this was a billing recovery renewal
      if (subtype === NotificationSubType.BILLING_RECOVERY) {
        updates.billing_retry_recovered = true
        updates.billing_retry_recovered_at = FieldValue.serverTimestamp()
      }
      // Trial converted — renewal after trial period
      updates.is_trial = false
      break

    case NotificationType.DID_FAIL_TO_RENEW:
      updates.is_in_billing_retry = true
      updates.subscription_status = 'billing_retry'
      updates.billing_retry_started_at = FieldValue.serverTimestamp()
      if (subtype === NotificationSubType.GRACE_PERIOD) {
        updates.is_in_grace_period = true
        if (renewalInfo?.gracePeriodExpiresDate) {
          updates.grace_period_expires_date = new Date(renewalInfo.gracePeriodExpiresDate)
        }
      }
      break

    case NotificationType.GRACE_PERIOD_EXPIRED:
      updates.is_in_grace_period = false
      updates.is_in_billing_retry = true
      updates.subscription_status = 'billing_retry'
      break

    case NotificationType.EXPIRED:
      updates.is_subscribed = false
      updates.was_previously_premium = true
      updates.is_in_billing_retry = false
      updates.is_in_grace_period = false
      updates.is_trial = false
      updates.subscription_expired_at = FieldValue.serverTimestamp()
      if (subtype === NotificationSubType.VOLUNTARY) {
        updates.subscription_status = 'churned_voluntary'
        updates.churn_reason = 'voluntary'
      } else if (subtype === NotificationSubType.BILLING_RETRY) {
        updates.subscription_status = 'churned_billing'
        updates.churn_reason = 'billing_failure'
      } else if (subtype === NotificationSubType.PRODUCT_NOT_FOR_SALE) {
        updates.subscription_status = 'churned_product_removed'
        updates.churn_reason = 'product_not_for_sale'
      }
      break

    case NotificationType.DID_CHANGE_RENEWAL_STATUS:
      if (subtype === NotificationSubType.AUTO_RENEW_DISABLED) {
        updates.auto_renew_disabled = true
        updates.auto_renew_disabled_at = FieldValue.serverTimestamp()
        updates.subscription_status = 'pending_churn'
      } else if (subtype === NotificationSubType.AUTO_RENEW_ENABLED) {
        updates.auto_renew_disabled = false
        updates.subscription_status = 'active'
      }
      break

    case NotificationType.REFUND:
      updates.is_subscribed = false
      updates.was_previously_premium = true
      updates.is_in_billing_retry = false
      updates.subscription_status = 'refunded'
      updates.refunded_at = FieldValue.serverTimestamp()
      updates.churn_reason = 'refund'
      break

    case NotificationType.REVOKE:
      updates.is_subscribed = false
      updates.was_previously_premium = true
      updates.subscription_status = 'revoked'
      updates.churn_reason = 'revoked'
      break

    case NotificationType.RENEWAL_EXTENDED:
      // Billing retry was recovered by Apple extending the renewal
      updates.is_in_billing_retry = false
      updates.is_subscribed = true
      updates.subscription_status = 'active'
      updates.billing_retry_recovered = true
      updates.billing_retry_recovered_at = FieldValue.serverTimestamp()
      if (transactionInfo?.expiresDate) {
        updates.subscription_expires_date = new Date(transactionInfo.expiresDate)
      }
      break

    case NotificationType.DID_CHANGE_RENEWAL_PREF:
      // User changed their plan (upgrade/downgrade)
      if (transactionInfo?.productId) {
        updates.subscription_product_id = transactionInfo.productId
      }
      if (subtype === NotificationSubType.UPGRADE) {
        updates.subscription_change = 'upgrade'
      } else if (subtype === NotificationSubType.DOWNGRADE) {
        updates.subscription_change = 'downgrade'
      }
      break

    case NotificationType.OFFER_REDEEMED:
      updates.offer_redeemed = true
      updates.offer_redeemed_at = FieldValue.serverTimestamp()
      if (transactionInfo?.offerIdentifier) {
        updates.last_offer_id = transactionInfo.offerIdentifier
      }
      break

    case NotificationType.TEST:
      // Test notification — no user updates needed
      break

    default:
      // Log unknown types but don't fail
      console.log(`Unhandled notification type: ${notificationType}`)
  }

  // Only update user if we have meaningful changes beyond the event tracking fields
  if (Object.keys(updates).length > 2) {
    // Clear any manual override since we now have real data from Apple
    updates.subscription_status_override = null
    updates.subscription_status_override_at = null
    await userRef.update(updates)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AppleNotificationRequest = await request.json()

    if (!body.signedPayload) {
      return NextResponse.json({ error: 'Missing signedPayload' }, { status: 400 })
    }

    // Decode and verify the outer JWS payload
    const notification = await decodeAppleJWS<DecodedNotificationPayload>(body.signedPayload)

    // Decode nested transaction and renewal info (already trusted since outer was verified)
    let transactionInfo: JWSTransactionDecodedPayload | null = null
    let renewalInfo: JWSRenewalInfoDecodedPayload | null = null

    if (notification.data.signedTransactionInfo) {
      transactionInfo = decodeJWSPayload<JWSTransactionDecodedPayload>(
        notification.data.signedTransactionInfo
      )
    }

    if (notification.data.signedRenewalInfo) {
      renewalInfo = decodeJWSPayload<JWSRenewalInfoDecodedPayload>(
        notification.data.signedRenewalInfo
      )
    }

    const db = getFirestoreDb()

    // Resolve device ID
    let deviceId: string | null = null
    if (transactionInfo) {
      deviceId = await resolveDeviceId(db, transactionInfo)
    }

    // Process the notification
    await processNotification(db, notification, transactionInfo, renewalInfo, deviceId)

    console.log(
      `Apple notification processed: ${notification.notificationType}` +
        (notification.subtype ? `/${notification.subtype}` : '') +
        ` | device: ${deviceId || 'unmatched'}` +
        ` | product: ${transactionInfo?.productId || 'n/a'}`
    )

    // Apple expects 200 OK — any non-200 triggers retries
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Apple notification error:', error)

    // Still return 200 to prevent Apple from retrying on validation errors
    // Log the error for debugging but don't make Apple retry
    if (error instanceof Error && error.message.includes('verification failed')) {
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 403 })
    }

    // For other errors, return 200 to prevent retry loops
    // The error is logged for investigation
    return NextResponse.json({ ok: true, warning: 'Processed with errors' })
  }
}

// GET endpoint for checking webhook status
export async function GET() {
  return NextResponse.json({
    status: 'active',
    version: 'v2',
    description: 'Apple App Store Server Notifications v2 webhook',
  })
}
