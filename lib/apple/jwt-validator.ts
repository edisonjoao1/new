import * as crypto from 'crypto'

const APPLE_ROOT_CA_G3_URL = 'https://www.apple.com/certificateauthority/AppleRootCA-G3.cer'

let cachedRootCert: string | null = null

// Fetch and cache Apple's Root CA G3 certificate
async function getAppleRootCert(): Promise<string> {
  if (cachedRootCert) return cachedRootCert

  const response = await fetch(APPLE_ROOT_CA_G3_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch Apple Root CA: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  // Convert DER to PEM
  const base64 = buffer.toString('base64')
  const pem = `-----BEGIN CERTIFICATE-----\n${base64.match(/.{1,64}/g)!.join('\n')}\n-----END CERTIFICATE-----`
  cachedRootCert = pem
  return pem
}

// Decode a base64url string
function base64urlDecode(str: string): Buffer {
  // Add padding if needed
  let padded = str.replace(/-/g, '+').replace(/_/g, '/')
  while (padded.length % 4) padded += '='
  return Buffer.from(padded, 'base64')
}

// Verify the x5c certificate chain against Apple's root CA
function verifyCertificateChain(x5cCerts: string[], rootCertPem: string): crypto.X509Certificate {
  if (x5cCerts.length < 2) {
    throw new Error('Certificate chain must have at least 2 certificates')
  }

  // Convert x5c base64 DER certs to PEM format
  const pemCerts = x5cCerts.map(cert => {
    const formatted = cert.match(/.{1,64}/g)!.join('\n')
    return `-----BEGIN CERTIFICATE-----\n${formatted}\n-----END CERTIFICATE-----`
  })

  // x5c order: [leaf, intermediate, ...] — verify chain from root down
  const rootCert = new crypto.X509Certificate(rootCertPem)
  const certs = pemCerts.map(pem => new crypto.X509Certificate(pem))

  // The last cert in x5c should be signed by the root
  const intermediateCert = certs[certs.length - 1]
  if (!intermediateCert.verify(rootCert.publicKey)) {
    throw new Error('Intermediate certificate not signed by Apple Root CA')
  }

  // Walk down the chain verifying each cert
  for (let i = certs.length - 2; i >= 0; i--) {
    if (!certs[i].verify(certs[i + 1].publicKey)) {
      throw new Error(`Certificate at index ${i} not signed by its issuer`)
    }
  }

  // Return the leaf certificate (first in chain)
  return certs[0]
}

// Decode and verify a JWS signed by Apple
export async function decodeAppleJWS<T>(jws: string): Promise<T> {
  const parts = jws.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWS format: expected 3 parts')
  }

  const [headerB64, payloadB64, signatureB64] = parts

  // Decode header to get x5c certificate chain
  const header = JSON.parse(base64urlDecode(headerB64).toString('utf8'))
  const { x5c, alg } = header

  if (!x5c || !Array.isArray(x5c) || x5c.length === 0) {
    throw new Error('Missing x5c certificate chain in JWS header')
  }

  if (alg !== 'ES256') {
    throw new Error(`Unexpected algorithm: ${alg}, expected ES256`)
  }

  // Verify certificate chain against Apple's root CA
  const rootCertPem = await getAppleRootCert()
  const leafCert = verifyCertificateChain(x5c, rootCertPem)

  // Verify the JWS signature using the leaf certificate's public key
  const signedContent = `${headerB64}.${payloadB64}`
  const signature = base64urlDecode(signatureB64)

  // ES256 signatures in JWS are in raw r||s format (64 bytes)
  // Node.js crypto expects DER format, so convert
  const derSignature = rawToDer(signature)

  const isValid = crypto.verify(
    'SHA256',
    Buffer.from(signedContent, 'utf8'),
    {
      key: leafCert.publicKey,
      dsaEncoding: 'der',
    },
    derSignature
  )

  if (!isValid) {
    throw new Error('JWS signature verification failed')
  }

  // Decode and return the payload
  const payload = JSON.parse(base64urlDecode(payloadB64).toString('utf8'))
  return payload as T
}

// Convert raw ECDSA signature (r||s, 64 bytes) to DER format
function rawToDer(raw: Buffer): Buffer {
  if (raw.length !== 64) {
    // Already in DER format or unexpected length, return as-is
    return raw
  }

  const r = raw.subarray(0, 32)
  const s = raw.subarray(32, 64)

  function encodeInteger(buf: Buffer): Buffer {
    // Remove leading zeros but keep one if high bit is set
    let start = 0
    while (start < buf.length - 1 && buf[start] === 0) start++
    let trimmed = buf.subarray(start)
    // If high bit is set, prepend a zero byte
    if (trimmed[0] & 0x80) {
      trimmed = Buffer.concat([Buffer.from([0]), trimmed])
    }
    return Buffer.concat([Buffer.from([0x02, trimmed.length]), trimmed])
  }

  const rDer = encodeInteger(r)
  const sDer = encodeInteger(s)
  const totalLen = rDer.length + sDer.length

  return Buffer.concat([Buffer.from([0x30, totalLen]), rDer, sDer])
}

// Decode JWS payload WITHOUT verification (for already-trusted nested payloads)
export function decodeJWSPayload<T>(jws: string): T {
  const parts = jws.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWS format')
  }
  const payload = JSON.parse(base64urlDecode(parts[1]).toString('utf8'))
  return payload as T
}
