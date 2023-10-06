const base64Encode = (bytes) => {
    const CHUNK_SIZE = 0x8000;
    const arr = [];
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        arr.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(''));
};
const base64Decode = (encoded) => {
    return new Uint8Array(atob(encoded)
        .split('')
        .map((c) => c.charCodeAt(0)));
};

function encode(input, urlsafe = false, padding = true) {
    let base64 = '';
    {
        const bytes = (typeof input === 'string')
            ? (new TextEncoder()).encode(input)
            : new Uint8Array(input);
        base64 = base64Encode(bytes);
    }
    if (urlsafe)
        base64 = base64ToBase64url(base64);
    if (!padding)
        base64 = removeBase64Padding(base64);
    return base64;
}
function decode(base64, stringOutput = false) {
    {
        let urlsafe = false;
        if (/^[0-9a-zA-Z_-]+={0,2}$/.test(base64)) {
            urlsafe = true;
        }
        else if (!/^[0-9a-zA-Z+/]*={0,2}$/.test(base64)) {
            throw new Error('Not a valid base64 input');
        }
        if (urlsafe)
            base64 = base64urlToBase64(base64);
        const bytes = base64Decode(base64);
        return stringOutput
            ? (new TextDecoder()).decode(bytes)
            : bytes;
    }
}
function base64ToBase64url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_');
}
function base64urlToBase64(base64url) {
    return base64url.replace(/-/g, '+').replace(/_/g, '/').replace(/=/g, '');
}
function removeBase64Padding(str) {
    return str.replace(/=/g, '');
}

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
    return await crypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
}
async function deriveKey(password, bitLength = 256, extractable = false, pbkdf2Params = {
    hash: 'SHA-256',
    iterations: 100000,
    salt: crypto.getRandomValues(new Uint8Array(16))
}) {
    if (pbkdf2Params.hash === undefined) {
        pbkdf2Params.hash = 'SHA-256';
    }
    if (pbkdf2Params.iterations === undefined) {
        pbkdf2Params.iterations = 100000;
    }
    if (pbkdf2Params.salt === undefined) {
        pbkdf2Params.salt = crypto.getRandomValues(new Uint8Array(16));
    }
    const params = {
        name: 'PBKDF2',
        ...pbkdf2Params
    };
    const masterKey = await crypto.subtle.importKey('raw', (new TextEncoder()).encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(params, masterKey, { name: 'AES-GCM', length: bitLength }, extractable, ['encrypt', 'decrypt']);
    return {
        key,
        salt: params.salt
    };
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
async function encrypt(plaintext, key, iv = crypto.getRandomValues(new Uint8Array(16))) {
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await crypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return new Ciphertext(encrypted, iv);
}
async function decrypt(ciphertext, key) {
    const c = (ciphertext instanceof Ciphertext) ? ciphertext : Ciphertext.fromJSON(ciphertext);
    const aesGcmParams = { name: 'AES-GCM', iv: c.iv };
    return await crypto.subtle.decrypt(aesGcmParams, key, c.encrypted);
}

export { Ciphertext, decrypt, deriveKey, encrypt, exportJwk, generateKey, importKey };
