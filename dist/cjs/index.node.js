'use strict';

var crypto = require('crypto');
var base64 = require('@juanelas/base64');

class Ciphertext {
    constructor(encrypted, iv) {
        this.encrypted = encrypted;
        this.iv = iv;
    }
    toJSON() {
        const ciphertext = {
            encrypted: base64.encode(this.encrypted, true, false),
            iv: base64.encode(this.iv, true, false)
        };
        return ciphertext;
    }
    static fromJSON(json) {
        const cJson = (typeof json === 'string') ? JSON.parse(json) : json;
        return new Ciphertext(base64.decode(cJson.encrypted), base64.decode(cJson.iv));
    }
}

async function generateKey(bitLength = 256, extractable = false) {
    const aesGcmParams = {
        name: 'AES-GCM',
        length: bitLength
    };
    return await crypto.webcrypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
}
async function deriveKey(password, bitLength = 256, extractable = false, pbkdf2Params = {
    hash: 'SHA-256',
    iterations: 100000,
    salt: crypto.webcrypto.getRandomValues(new Uint8Array(16))
}) {
    if (pbkdf2Params.hash === undefined) {
        pbkdf2Params.hash = 'SHA-256';
    }
    if (pbkdf2Params.iterations === undefined) {
        pbkdf2Params.iterations = 100000;
    }
    if (pbkdf2Params.salt === undefined) {
        pbkdf2Params.salt = crypto.webcrypto.getRandomValues(new Uint8Array(16));
    }
    const params = {
        name: 'PBKDF2',
        ...pbkdf2Params
    };
    const masterKey = await crypto.webcrypto.subtle.importKey('raw', (new TextEncoder()).encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.webcrypto.subtle.deriveKey(params, masterKey, { name: 'AES-GCM', length: bitLength }, extractable, ['encrypt', 'decrypt']);
    return {
        key,
        salt: params.salt
    };
}
async function exportJwk(key) {
    if (!key.extractable) {
        throw new Error('Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key');
    }
    return await crypto.webcrypto.subtle.exportKey('jwk', key);
}
async function importKey(key, extractable = false) {
    if (key.byteLength !== undefined) {
        return await crypto.webcrypto.subtle.importKey('raw', key, {
            name: 'AES-GCM'
        }, extractable, ['encrypt', 'decrypt']);
    }
    return await crypto.webcrypto.subtle.importKey('jwk', key, {
        name: 'AES-GCM'
    }, extractable, ['encrypt', 'decrypt']);
}
async function encrypt(plaintext, key, iv = crypto.webcrypto.getRandomValues(new Uint8Array(16))) {
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await crypto.webcrypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return new Ciphertext(encrypted, iv);
}
async function decrypt(ciphertext, key) {
    const c = (ciphertext instanceof Ciphertext) ? ciphertext : Ciphertext.fromJSON(ciphertext);
    const aesGcmParams = { name: 'AES-GCM', iv: c.iv };
    return await crypto.webcrypto.subtle.decrypt(aesGcmParams, key, c.encrypted);
}

exports.Ciphertext = Ciphertext;
exports.decrypt = decrypt;
exports.deriveKey = deriveKey;
exports.encrypt = encrypt;
exports.exportJwk = exportJwk;
exports.generateKey = generateKey;
exports.importKey = importKey;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL0NoaXBlcnRleHQudHMiLCIuLi8uLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbImVuY29kZSIsImRlY29kZSIsImNyeXB0byJdLCJtYXBwaW5ncyI6Ijs7Ozs7TUFZYSxVQUFVLENBQUE7SUFJckIsV0FBYSxDQUFBLFNBQWdELEVBQUUsRUFBeUMsRUFBQTtBQUN0RyxRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLFFBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7S0FDYjtJQUVELE1BQU0sR0FBQTtBQUNKLFFBQUEsTUFBTSxVQUFVLEdBQUc7WUFDakIsU0FBUyxFQUFFQSxhQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQzlDLEVBQUUsRUFBRUEsYUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztTQUNqQyxDQUFBO0FBQ0QsUUFBQSxPQUFPLFVBQVUsQ0FBQTtLQUNsQjtJQUVELE9BQU8sUUFBUSxDQUFFLElBQTZCLEVBQUE7UUFDNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7QUFDbEUsUUFBQSxPQUFPLElBQUksVUFBVSxDQUFDQyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFQSxhQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDakU7QUFDRjs7QUN0Qk0sZUFBZSxXQUFXLENBQUUsU0FBMEIsR0FBQSxHQUFHLEVBQUUsV0FBQSxHQUF1QixLQUFLLEVBQUE7QUFDNUYsSUFBQSxNQUFNLFlBQVksR0FBb0I7QUFDcEMsUUFBQSxJQUFJLEVBQUUsU0FBUztBQUNm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
