export type AesKeyLength = 128 | 192 | 256

export async function generateKey (bitLength: number = 256, extractable: boolean = false): Promise<CryptoKey> {
  const aesGcmParams: AesKeyGenParams = {
    name: 'AES-GCM',
    length: bitLength
  }
  return await crypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt'])
}

export async function exportJwk (key: CryptoKey): Promise<JsonWebKey> {
  if (!key.extractable) {
    throw new Error('Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key')
  }
  return await crypto.subtle.exportKey('jwk', key)
}

export async function importKey (key: JsonWebKey | BufferSource, extractable: boolean = false): Promise<CryptoKey> {
  if ((key as ArrayBuffer).byteLength !== undefined) {
    return await crypto.subtle.importKey('raw', key as BufferSource, {
      name: 'AES-GCM'
    }, extractable, ['encrypt', 'decrypt'])
  }
  return await crypto.subtle.importKey('jwk', key as JsonWebKey, {
    name: 'AES-GCM'
  }, extractable, ['encrypt', 'decrypt'])
}

export interface Ciphertext {
  encrypted: ArrayBuffer
  iv: Uint8Array
}

export async function encrypt (plaintext: BufferSource, key: CryptoKey): Promise<Ciphertext> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const aesGcmParams: AesGcmParams = {
    name: 'AES-GCM',
    iv
  }
  const encrypted = await crypto.subtle.encrypt(aesGcmParams, key, plaintext)
  return {
    encrypted,
    iv
  }
}

export async function decrypt (ciphertext: Ciphertext, key: CryptoKey): Promise<ArrayBuffer> {
  const aesGcmParams: AesGcmParams = { name: 'AES-GCM', iv: ciphertext.iv }
  return await crypto.subtle.decrypt(aesGcmParams, key, ciphertext.encrypted)
}
