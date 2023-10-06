import { Ciphertext, CiphertextJson, TypedArray } from './Chipertext'
export * from './Chipertext.js'

export type aesKeyLength = 128 | 192 | 256

/**
 * Generates new key for AES-GCM
 * @param bitLength - the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments
 * @param extractable - a boolean value indicating whether it will be possible to export the key using {@link exportJwk}
 * @returns
 */
export async function generateKey (bitLength: aesKeyLength = 256, extractable: boolean = false): Promise<CryptoKey> {
  const aesGcmParams: AesKeyGenParams = {
    name: 'AES-GCM',
    length: bitLength
  }
  return await crypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt'])
}

export interface DerivedKey {
  key: CryptoKey
  salt: BufferSource
}

export type Pbkdf2Parameters = Partial<Omit<Pbkdf2Params, 'name'>>

/**
 * Derives an AES-GCM key from a password. It internally uses PBKDF2.
 * @param password - a string containing a password
 * @param bitLength - the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments
 * @param extractable - a boolean value indicating whether it will be possible to export the key using {@link exportJwk}
 * @param pbkdf2Params - Overwrite PBKDF2 parameters (hash, iterations, salt)
 * @returns A cryptoKey object along with the salt that was used to generate it
 */
export async function deriveKey (password: string, bitLength: aesKeyLength = 256, extractable: boolean = false, pbkdf2Params: Pbkdf2Parameters = {
  hash: 'SHA-256',
  iterations: 100000,
  salt: crypto.getRandomValues(new Uint8Array(16))
}): Promise<DerivedKey> {
  if (pbkdf2Params.hash === undefined) {
    pbkdf2Params.hash = 'SHA-256'
  }
  if (pbkdf2Params.iterations === undefined) {
    pbkdf2Params.iterations = 100000
  }
  if (pbkdf2Params.salt === undefined) {
    pbkdf2Params.salt = crypto.getRandomValues(new Uint8Array(16))
  }
  const params: Pbkdf2Params = {
    name: 'PBKDF2',
    ...pbkdf2Params as Omit<Pbkdf2Params, 'name'>
  }
  const masterKey = await crypto.subtle.importKey(
    'raw',
    (new TextEncoder()).encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    params,
    masterKey,
    { name: 'AES-GCM', length: bitLength },
    extractable,
    ['encrypt', 'decrypt']
  )
  return {
    key,
    salt: params.salt
  }
}

/**
 * Exports key as a valid JWK object
 * @param key
 * @returns
 */
export async function exportJwk (key: CryptoKey): Promise<JsonWebKey> {
  if (!key.extractable) {
    throw new Error('Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key')
  }
  return await crypto.subtle.exportKey('jwk', key)
}

/**
 * Imports key defined in a JWK object or a buffer
 * @param key
 * @param extractable - a boolean value indicating whether it will be possible to export the imported key using {@link exportJwk}
 * @returns
 */
export async function importKey (key: JsonWebKey | ArrayBufferLike | TypedArray | Buffer, extractable: boolean = false): Promise<CryptoKey> {
  if ((key as ArrayBufferLike | TypedArray | Buffer).byteLength !== undefined) {
    return await crypto.subtle.importKey('raw', key as BufferSource, {
      name: 'AES-GCM'
    }, extractable, ['encrypt', 'decrypt'])
  }
  return await crypto.subtle.importKey('jwk', key as JsonWebKey, {
    name: 'AES-GCM'
  }, extractable, ['encrypt', 'decrypt'])
}

/**
 * Encrypts plaintext with key
 * @param plaintext
 * @param key
 * @returns
 */
export async function encrypt (plaintext: ArrayBufferLike | TypedArray | Buffer, key: CryptoKey, iv: ArrayBufferLike | TypedArray | Buffer = crypto.getRandomValues(new Uint8Array(16))): Promise<Ciphertext> {
  const aesGcmParams: AesGcmParams = {
    name: 'AES-GCM',
    iv
  }
  const encrypted = await crypto.subtle.encrypt(aesGcmParams, key, plaintext)
  return new Ciphertext(encrypted, iv)
}

/**
 * Decrypts ciphertext.encrypted using IV in ciphertext.iv and provided key
 * @param ciphertext - a {@link Ciphertext} object, or its JSON equivalent {@link CiphertextJson} or a string that can be JSON.parsed to a {@link CiphertextJson}
 * @param key
 * @returns
 */
export async function decrypt (ciphertext: Ciphertext | CiphertextJson | string, key: CryptoKey): Promise<ArrayBuffer> {
  const c = (ciphertext instanceof Ciphertext) ? ciphertext : Ciphertext.fromJSON(ciphertext)
  const aesGcmParams: AesGcmParams = { name: 'AES-GCM', iv: c.iv }
  return await crypto.subtle.decrypt(aesGcmParams, key, c.encrypted)
}
