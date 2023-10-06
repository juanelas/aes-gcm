/// <reference types="node" />
/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 */
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
interface CiphertextJson {
    encrypted: string;
    iv: string;
}
declare class Ciphertext {
    encrypted: ArrayBufferLike | TypedArray | Buffer;
    iv: ArrayBufferLike | TypedArray | Buffer;
    constructor(encrypted: ArrayBufferLike | TypedArray | Buffer, iv: ArrayBufferLike | TypedArray | Buffer);
    toJSON(): CiphertextJson;
    static fromJSON(json: CiphertextJson | string): Ciphertext;
}

type aesKeyLength = 128 | 192 | 256;
/**
 * Generates new key for AES-GCM
 * @param bitLength - the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments
 * @param extractable - a boolean value indicating whether it will be possible to export the key using {@link exportJwk}
 * @returns
 */
declare function generateKey(bitLength?: aesKeyLength, extractable?: boolean): Promise<CryptoKey>;
interface DerivedKey {
    key: CryptoKey;
    salt: BufferSource;
}
type Pbkdf2Parameters = Partial<Omit<Pbkdf2Params, 'name'>>;
/**
 * Derives an AES-GCM key from a password. It internally uses PBKDF2.
 * @param password - a string containing a password
 * @param bitLength - the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments
 * @param extractable - a boolean value indicating whether it will be possible to export the key using {@link exportJwk}
 * @param pbkdf2Params - Overwrite PBKDF2 parameters (hash, iterations, salt)
 * @returns A cryptoKey object along with the salt that was used to generate it
 */
declare function deriveKey(password: string, bitLength?: aesKeyLength, extractable?: boolean, pbkdf2Params?: Pbkdf2Parameters): Promise<DerivedKey>;
/**
 * Exports key as a valid JWK object
 * @param key
 * @returns
 */
declare function exportJwk(key: CryptoKey): Promise<JsonWebKey>;
/**
 * Imports key defined in a JWK object or a buffer
 * @param key
 * @param extractable - a boolean value indicating whether it will be possible to export the imported key using {@link exportJwk}
 * @returns
 */
declare function importKey(key: JsonWebKey | ArrayBufferLike | TypedArray | Buffer, extractable?: boolean): Promise<CryptoKey>;
/**
 * Encrypts plaintext with key
 * @param plaintext
 * @param key
 * @returns
 */
declare function encrypt(plaintext: ArrayBufferLike | TypedArray | Buffer, key: CryptoKey, iv?: ArrayBufferLike | TypedArray | Buffer): Promise<Ciphertext>;
/**
 * Decrypts ciphertext.encrypted using IV in ciphertext.iv and provided key
 * @param ciphertext - a {@link Ciphertext} object, or its JSON equivalent {@link CiphertextJson} or a string that can be JSON.parsed to a {@link CiphertextJson}
 * @param key
 * @returns
 */
declare function decrypt(ciphertext: Ciphertext | CiphertextJson | string, key: CryptoKey): Promise<ArrayBuffer>;

export { Ciphertext, type CiphertextJson, type DerivedKey, type Pbkdf2Parameters, type TypedArray, type aesKeyLength, decrypt, deriveKey, encrypt, exportJwk, generateKey, importKey };
