type AesKeyLength = 128 | 192 | 256;
declare function generateKey(bitLength?: number, extractable?: boolean): Promise<CryptoKey>;
declare function exportJwk(key: CryptoKey): Promise<JsonWebKey>;
declare function importKey(key: JsonWebKey | BufferSource, extractable?: boolean): Promise<CryptoKey>;
interface Ciphertext {
    encrypted: ArrayBuffer;
    iv: Uint8Array;
}
declare function encrypt(plaintext: BufferSource, key: CryptoKey): Promise<Ciphertext>;
declare function decrypt(ciphertext: Ciphertext, key: CryptoKey): Promise<ArrayBuffer>;

export { type AesKeyLength, type Ciphertext, decrypt, encrypt, exportJwk, generateKey, importKey };
