async function generateKey(bitLength = 256, extractable = false) {
    const aesGcmParams = {
        name: 'AES-GCM',
        length: bitLength
    };
    return await crypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
}
async function exportJwk(key) {
    if (!key.extractable) {
        throw new Error('Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key');
    }
    return await crypto.subtle.exportKey('jwk', key);
}
async function importKey(key, extractable = false) {
    if (key.byteLength !== undefined) {
        return await crypto.subtle.importKey('raw', key, {
            name: 'AES-GCM'
        }, extractable, ['encrypt', 'decrypt']);
    }
    return await crypto.subtle.importKey('jwk', key, {
        name: 'AES-GCM'
    }, extractable, ['encrypt', 'decrypt']);
}
async function encrypt(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await crypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return {
        encrypted,
        iv
    };
}
async function decrypt(ciphertext, key) {
    const aesGcmParams = { name: 'AES-GCM', iv: ciphertext.iv };
    return await crypto.subtle.decrypt(aesGcmParams, key, ciphertext.encrypted);
}

export { decrypt, encrypt, exportJwk, generateKey, importKey };
