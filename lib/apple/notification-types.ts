// Apple App Store Server Notifications v2 Types

export enum NotificationType {
  CONSUMPTION_REQUEST = 'CONSUMPTION_REQUEST',
  DID_CHANGE_RENEWAL_PREF = 'DID_CHANGE_RENEWAL_PREF',
  DID_CHANGE_RENEWAL_STATUS = 'DID_CHANGE_RENEWAL_STATUS',
  DID_FAIL_TO_RENEW = 'DID_FAIL_TO_RENEW',
  DID_RENEW = 'DID_RENEW',
  EXPIRED = 'EXPIRED',
  EXTERNAL_PURCHASE_TOKEN = 'EXTERNAL_PURCHASE_TOKEN',
  GRACE_PERIOD_EXPIRED = 'GRACE_PERIOD_EXPIRED',
  OFFER_REDEEMED = 'OFFER_REDEEMED',
  ONE_TIME_CHARGE = 'ONE_TIME_CHARGE',
  PRICE_INCREASE = 'PRICE_INCREASE',
  REFUND = 'REFUND',
  REFUND_DECLINED = 'REFUND_DECLINED',
  REFUND_REVERSED = 'REFUND_REVERSED',
  RENEWAL_EXTENDED = 'RENEWAL_EXTENDED',
  RENEWAL_EXTENSION = 'RENEWAL_EXTENSION',
  REVOKE = 'REVOKE',
  SUBSCRIBED = 'SUBSCRIBED',
  TEST = 'TEST',
}

export enum NotificationSubType {
  ACCEPTED = 'ACCEPTED',
  AUTO_RENEW_DISABLED = 'AUTO_RENEW_DISABLED',
  AUTO_RENEW_ENABLED = 'AUTO_RENEW_ENABLED',
  BILLING_RECOVERY = 'BILLING_RECOVERY',
  BILLING_RETRY = 'BILLING_RETRY',
  DOWNGRADE = 'DOWNGRADE',
  FAILURE = 'FAILURE',
  GRACE_PERIOD = 'GRACE_PERIOD',
  INITIAL_BUY = 'INITIAL_BUY',
  PENDING = 'PENDING',
  PRODUCT_NOT_FOR_SALE = 'PRODUCT_NOT_FOR_SALE',
  RESUBSCRIBE = 'RESUBSCRIBE',
  SUMMARY = 'SUMMARY',
  UPGRADE = 'UPGRADE',
  VOLUNTARY = 'VOLUNTARY',
}

export enum TransactionType {
  AUTO_RENEWABLE = 'Auto-Renewable Subscription',
  NON_CONSUMABLE = 'Non-Consumable',
  CONSUMABLE = 'Consumable',
  NON_RENEWING = 'Non-Renewing Subscription',
}

export enum OwnershipType {
  FAMILY_SHARED = 'FAMILY_SHARED',
  PURCHASED = 'PURCHASED',
}

export interface JWSTransactionDecodedPayload {
  transactionId: string
  originalTransactionId: string
  bundleId: string
  productId: string
  purchaseDate: number // milliseconds
  originalPurchaseDate: number
  expiresDate?: number
  quantity: number
  type: string
  appAccountToken?: string // UUID we set during purchase (= device ID)
  inAppOwnershipType: string
  signedDate: number
  environment: 'Sandbox' | 'Production'
  transactionReason?: string
  storefront?: string
  storefrontId?: string
  price?: number
  currency?: string
  offerType?: number
  offerIdentifier?: string
  revocationDate?: number
  revocationReason?: number
}

export interface JWSRenewalInfoDecodedPayload {
  expirationIntent?: number
  originalTransactionId: string
  autoRenewProductId: string
  productId: string
  autoRenewStatus: number // 0 = off, 1 = on
  isInBillingRetryPeriod?: boolean
  priceIncreaseStatus?: number
  gracePeriodExpiresDate?: number
  offerType?: number
  offerIdentifier?: string
  signedDate: number
  environment: 'Sandbox' | 'Production'
  recentSubscriptionStartDate?: number
  renewalDate?: number
  renewalPrice?: number
  currency?: string
}

export interface NotificationData {
  appAppleId?: number
  bundleId: string
  bundleVersion?: string
  environment: 'Sandbox' | 'Production'
  signedTransactionInfo?: string // JWS
  signedRenewalInfo?: string // JWS
  status?: number
  consumptionRequestReason?: string
}

export interface DecodedNotificationPayload {
  notificationType: NotificationType
  subtype?: NotificationSubType
  notificationUUID: string
  data: NotificationData
  version: string
  signedDate: number
  summary?: {
    requestIdentifier: string
    environment: 'Sandbox' | 'Production'
    appAppleId: number
    bundleId: string
    productId: string
    storefrontCountryCodes: string[]
    failedCount: number
    succeededCount: number
  }
}

export interface AppleNotificationRequest {
  signedPayload: string
}
