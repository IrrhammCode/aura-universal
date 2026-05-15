import crypto from 'crypto';

// AES-256-GCM encryption for API keys at rest
// Uses a 32-byte secret derived from the ENCRYPTION_SECRET env var

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;       // 96-bit IV for GCM
const TAG_LENGTH = 16;      // 128-bit auth tag
const ENCODING = 'hex';

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || 'aura-default-secret-change-me!!';
  // Derive a 32-byte key from the secret
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext string (e.g., an API key).
 * Returns a hex-encoded string in format: iv:encrypted:tag
 */
export function encryptApiKey(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);
  
  const tag = cipher.getAuthTag();
  
  return `${iv.toString(ENCODING)}:${encrypted}:${tag.toString(ENCODING)}`;
}

/**
 * Decrypts a previously encrypted API key.
 * Expects input in format: iv:encrypted:tag
 */
export function decryptApiKey(encryptedStr: string): string {
  const key = getEncryptionKey();
  const [ivHex, encryptedHex, tagHex] = encryptedStr.split(':');
  
  if (!ivHex || !encryptedHex || !tagHex) {
    // If the key doesn't look encrypted (legacy plaintext), return as-is
    return encryptedStr;
  }
  
  try {
    const iv = Buffer.from(ivHex, ENCODING);
    const tag = Buffer.from(tagHex, ENCODING);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedHex, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    // If decryption fails, assume it's a legacy plaintext key
    console.warn('Decryption failed, treating as plaintext:', err);
    return encryptedStr;
  }
}

/**
 * Checks if a string appears to be encrypted (iv:data:tag format).
 */
export function isEncrypted(value: string): boolean {
  const parts = value.split(':');
  return parts.length === 3 && parts[0].length === IV_LENGTH * 2;
}
