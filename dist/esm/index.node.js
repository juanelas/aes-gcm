import { webcrypto } from 'crypto';
import { encode, decode } from '@juanelas/base64';

class Ciphertext {
    constructor(encrypted, iv) {
        this.encrypted = encrypted;
        this.iv = iv;
    }
    toJSON() {
        const ciphertext = {
            encrypted: encode(this.encrypted, true, false),
            iv: encode(this.iv, true, false)
        };
        return ciphertext;
    }
    static fromJSON(json) {
        const cJson = (typeof json === 'string') ? JSON.parse(json) : json;
        return new Ciphertext(decode(cJson.encrypted), decode(cJson.iv));
    }
}

async function generateKey(bitLength = 256, extractable = false) {
    const aesGcmParams = {
        name: 'AES-GCM',
        length: bitLength
    };
    return await webcrypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
}
async function deriveKey(password, bitLength = 256, extractable = false, pbkdf2Params = {
    hash: 'SHA-256',
    iterations: 100000,
    salt: webcrypto.getRandomValues(new Uint8Array(16))
}) {
    if (pbkdf2Params.hash === undefined) {
        pbkdf2Params.hash = 'SHA-256';
    }
    if (pbkdf2Params.iterations === undefined) {
        pbkdf2Params.iterations = 100000;
    }
    if (pbkdf2Params.salt === undefined) {
        pbkdf2Params.salt = webcrypto.getRandomValues(new Uint8Array(16));
    }
    const params = {
        name: 'PBKDF2',
        ...pbkdf2Params
    };
    const masterKey = await webcrypto.subtle.importKey('raw', (new TextEncoder()).encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await webcrypto.subtle.deriveKey(params, masterKey, { name: 'AES-GCM', length: bitLength }, extractable, ['encrypt', 'decrypt']);
    return {
        key,
        salt: params.salt
    };
}
async function exportJwk(key) {
    if (!key.extractable) {
        throw new Error('Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key');
    }
    return await webcrypto.subtle.exportKey('jwk', key);
}
async function importKey(key, extractable = false) {
    if (key.byteLength !== undefined) {
        return await webcrypto.subtle.importKey('raw', key, {
            name: 'AES-GCM'
        }, extractable, ['encrypt', 'decrypt']);
    }
    return await webcrypto.subtle.importKey('jwk', key, {
        name: 'AES-GCM'
    }, extractable, ['encrypt', 'decrypt']);
}
async function encrypt(plaintext, key, iv = webcrypto.getRandomValues(new Uint8Array(16))) {
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await webcrypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return new Ciphertext(encrypted, iv);
}
async function decrypt(ciphertext, key) {
    const c = (ciphertext instanceof Ciphertext) ? ciphertext : Ciphertext.fromJSON(ciphertext);
    const aesGcmParams = { name: 'AES-GCM', iv: c.iv };
    return await webcrypto.subtle.decrypt(aesGcmParams, key, c.encrypted);
}

export { Ciphertext, decrypt, deriveKey, encrypt, exportJwk, generateKey, importKey };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL0NoaXBlcnRleHQudHMiLCIuLi8uLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbImNyeXB0byJdLCJtYXBwaW5ncyI6Ijs7O01BWWEsVUFBVSxDQUFBO0lBSXJCLFdBQWEsQ0FBQSxTQUFnRCxFQUFFLEVBQXlDLEVBQUE7QUFDdEcsUUFBQSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO0tBQ2I7SUFFRCxNQUFNLEdBQUE7QUFDSixRQUFBLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFNBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQzlDLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQ2pDLENBQUE7QUFDRCxRQUFBLE9BQU8sVUFBVSxDQUFBO0tBQ2xCO0lBRUQsT0FBTyxRQUFRLENBQUUsSUFBNkIsRUFBQTtRQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTtBQUNsRSxRQUFBLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDakU7QUFDRjs7QUN0Qk0sZUFBZSxXQUFXLENBQUUsU0FBMEIsR0FBQSxHQUFHLEVBQUUsV0FBQSxHQUF1QixLQUFLLEVBQUE7QUFDNUYsSUFBQSxNQUFNLFlBQVksR0FBb0I7QUFDcEMsUUFBQSxJQUFJLEVBQUUsU0FBUztBQUNmLFFBQUEsTUFBTSxFQUFFLFNBQVM7S0FD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
