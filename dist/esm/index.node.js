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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL0NoaXBlcnRleHQudHMiLCIuLi8uLi9zcmMvdHMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZW5jb2RlLCBkZWNvZGUgfSBmcm9tICdAanVhbmVsYXMvYmFzZTY0J1xuXG4vKipcbiAqIEEgVHlwZWRBcnJheSBvYmplY3QgZGVzY3JpYmVzIGFuIGFycmF5LWxpa2UgdmlldyBvZiBhbiB1bmRlcmx5aW5nIGJpbmFyeSBkYXRhIGJ1ZmZlci5cbiAqL1xuZXhwb3J0IHR5cGUgVHlwZWRBcnJheSA9IEludDhBcnJheSB8IFVpbnQ4QXJyYXkgfCBVaW50OENsYW1wZWRBcnJheSB8IEludDE2QXJyYXkgfCBVaW50MTZBcnJheSB8IEludDMyQXJyYXkgfCBVaW50MzJBcnJheSB8IEZsb2F0MzJBcnJheSB8IEZsb2F0NjRBcnJheSB8IEJpZ0ludDY0QXJyYXkgfCBCaWdVaW50NjRBcnJheVxuXG5leHBvcnQgaW50ZXJmYWNlIENpcGhlcnRleHRKc29uIHtcbiAgZW5jcnlwdGVkOiBzdHJpbmcgLy8gYmFzZTY0dXJsIHdpdGggbm8gcGFkZGluZ1xuICBpdjogc3RyaW5nIC8vIGJhc2U2NHVybCB3aXRoIG5vIHBhZGRpbmdcbn1cblxuZXhwb3J0IGNsYXNzIENpcGhlcnRleHQge1xuICBlbmNyeXB0ZWQ6IEFycmF5QnVmZmVyTGlrZSB8IFR5cGVkQXJyYXkgfCBCdWZmZXJcbiAgaXY6IEFycmF5QnVmZmVyTGlrZSB8IFR5cGVkQXJyYXkgfCBCdWZmZXJcblxuICBjb25zdHJ1Y3RvciAoZW5jcnlwdGVkOiBBcnJheUJ1ZmZlckxpa2UgfCBUeXBlZEFycmF5IHwgQnVmZmVyLCBpdjogQXJyYXlCdWZmZXJMaWtlIHwgVHlwZWRBcnJheSB8IEJ1ZmZlcikge1xuICAgIHRoaXMuZW5jcnlwdGVkID0gZW5jcnlwdGVkXG4gICAgdGhpcy5pdiA9IGl2XG4gIH1cblxuICB0b0pTT04gKCk6IENpcGhlcnRleHRKc29uIHtcbiAgICBjb25zdCBjaXBoZXJ0ZXh0ID0ge1xuICAgICAgZW5jcnlwdGVkOiBlbmNvZGUodGhpcy5lbmNyeXB0ZWQsIHRydWUsIGZhbHNlKSxcbiAgICAgIGl2OiBlbmNvZGUodGhpcy5pdiwgdHJ1ZSwgZmFsc2UpXG4gICAgfVxuICAgIHJldHVybiBjaXBoZXJ0ZXh0XG4gIH1cblxuICBzdGF0aWMgZnJvbUpTT04gKGpzb246IENpcGhlcnRleHRKc29uIHwgc3RyaW5nKTogQ2lwaGVydGV4dCB7XG4gICAgY29uc3QgY0pzb24gPSAodHlwZW9mIGpzb24gPT09ICdzdHJpbmcnKSA/IEpTT04ucGFyc2UoanNvbikgOiBqc29uXG4gICAgcmV0dXJuIG5ldyBDaXBoZXJ0ZXh0KGRlY29kZShjSnNvbi5lbmNyeXB0ZWQpLCBkZWNvZGUoY0pzb24uaXYpKVxuICB9XG59XG4iLCJpbXBvcnQgeyBDaXBoZXJ0ZXh0LCBDaXBoZXJ0ZXh0SnNvbiwgVHlwZWRBcnJheSB9IGZyb20gJy4vQ2hpcGVydGV4dCdcbmV4cG9ydCAqIGZyb20gJy4vQ2hpcGVydGV4dC5qcydcblxuZXhwb3J0IHR5cGUgYWVzS2V5TGVuZ3RoID0gMTI4IHwgMTkyIHwgMjU2XG5cbi8qKlxuICogR2VuZXJhdGVzIG5ldyBrZXkgZm9yIEFFUy1HQ01cbiAqIEBwYXJhbSBiaXRMZW5ndGggLSB0aGUgbGVuZ3RoIGluIGJpdHMgb2YgdGhlIGtleSB0byBnZW5lcmF0ZS4gVGhpcyBtdXN0IGJlIG9uZSBvZjogMTI4LCAxOTIsIG9yIDI1NiwgYWx0aG91Z2ggMTkyIG1hbnkgbm90IGJlIHN1cHBvdGVkIGluIHNvbWUgZW52aXJvbm1lbnRzXG4gKiBAcGFyYW0gZXh0cmFjdGFibGUgLSBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gZXhwb3J0IHRoZSBrZXkgdXNpbmcge0BsaW5rIGV4cG9ydEp3a31cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUtleSAoYml0TGVuZ3RoOiBhZXNLZXlMZW5ndGggPSAyNTYsIGV4dHJhY3RhYmxlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPENyeXB0b0tleT4ge1xuICBjb25zdCBhZXNHY21QYXJhbXM6IEFlc0tleUdlblBhcmFtcyA9IHtcbiAgICBuYW1lOiAnQUVTLUdDTScsXG4gICAgbGVuZ3RoOiBiaXRMZW5ndGhcbiAgfVxuICByZXR1cm4gYXdhaXQgY3J5cHRvLnN1YnRsZS5nZW5lcmF0ZUtleShhZXNHY21QYXJhbXMsIGV4dHJhY3RhYmxlLCBbJ2VuY3J5cHQnLCAnZGVjcnlwdCddKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlcml2ZWRLZXkge1xuICBrZXk6IENyeXB0b0tleVxuICBzYWx0OiBCdWZmZXJTb3VyY2Vcbn1cblxuZXhwb3J0IHR5cGUgUGJrZGYyUGFyYW1ldGVycyA9IFBhcnRpYWw8T21pdDxQYmtkZjJQYXJhbXMsICduYW1lJz4+XG5cbi8qKlxuICogRGVyaXZlcyBhbiBBRVMtR0NNIGtleSBmcm9tIGEgcGFzc3dvcmQuIEl0IGludGVybmFsbHkgdXNlcyBQQktERjIuXG4gKiBAcGFyYW0gcGFzc3dvcmQgLSBhIHN0cmluZyBjb250YWluaW5nIGEgcGFzc3dvcmRcbiAqIEBwYXJhbSBiaXRMZW5ndGggLSB0aGUgbGVuZ3RoIGluIGJpdHMgb2YgdGhlIGtleSB0byBnZW5lcmF0ZS4gVGhpcyBtdXN0IGJlIG9uZSBvZjogMTI4LCAxOTIsIG9yIDI1NiwgYWx0aG91Z2ggMTkyIG1hbnkgbm90IGJlIHN1cHBvdGVkIGluIHNvbWUgZW52aXJvbm1lbnRzXG4gKiBAcGFyYW0gZXh0cmFjdGFibGUgLSBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gZXhwb3J0IHRoZSBrZXkgdXNpbmcge0BsaW5rIGV4cG9ydEp3a31cbiAqIEBwYXJhbSBwYmtkZjJQYXJhbXMgLSBPdmVyd3JpdGUgUEJLREYyIHBhcmFtZXRlcnMgKGhhc2gsIGl0ZXJhdGlvbnMsIHNhbHQpXG4gKiBAcmV0dXJucyBBIGNyeXB0b0tleSBvYmplY3QgYWxvbmcgd2l0aCB0aGUgc2FsdCB0aGF0IHdhcyB1c2VkIHRvIGdlbmVyYXRlIGl0XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZXJpdmVLZXkgKHBhc3N3b3JkOiBzdHJpbmcsIGJpdExlbmd0aDogYWVzS2V5TGVuZ3RoID0gMjU2LCBleHRyYWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlLCBwYmtkZjJQYXJhbXM6IFBia2RmMlBhcmFtZXRlcnMgPSB7XG4gIGhhc2g6ICdTSEEtMjU2JyxcbiAgaXRlcmF0aW9uczogMTAwMDAwLFxuICBzYWx0OiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSlcbn0pOiBQcm9taXNlPERlcml2ZWRLZXk+IHtcbiAgaWYgKHBia2RmMlBhcmFtcy5oYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBwYmtkZjJQYXJhbXMuaGFzaCA9ICdTSEEtMjU2J1xuICB9XG4gIGlmIChwYmtkZjJQYXJhbXMuaXRlcmF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcGJrZGYyUGFyYW1zLml0ZXJhdGlvbnMgPSAxMDAwMDBcbiAgfVxuICBpZiAocGJrZGYyUGFyYW1zLnNhbHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHBia2RmMlBhcmFtcy5zYWx0ID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxNikpXG4gIH1cbiAgY29uc3QgcGFyYW1zOiBQYmtkZjJQYXJhbXMgPSB7XG4gICAgbmFtZTogJ1BCS0RGMicsXG4gICAgLi4ucGJrZGYyUGFyYW1zIGFzIE9taXQ8UGJrZGYyUGFyYW1zLCAnbmFtZSc+XG4gIH1cbiAgY29uc3QgbWFzdGVyS2V5ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgJ3JhdycsXG4gICAgKG5ldyBUZXh0RW5jb2RlcigpKS5lbmNvZGUocGFzc3dvcmQpLFxuICAgICdQQktERjInLFxuICAgIGZhbHNlLFxuICAgIFsnZGVyaXZlS2V5J11cbiAgKVxuICBjb25zdCBrZXkgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRlcml2ZUtleShcbiAgICBwYXJhbXMsXG4gICAgbWFzdGVyS2V5LFxuICAgIHsgbmFtZTogJ0FFUy1HQ00nLCBsZW5ndGg6IGJpdExlbmd0aCB9LFxuICAgIGV4dHJhY3RhYmxlLFxuICAgIFsnZW5jcnlwdCcsICdkZWNyeXB0J11cbiAgKVxuICByZXR1cm4ge1xuICAgIGtleSxcbiAgICBzYWx0OiBwYXJhbXMuc2FsdFxuICB9XG59XG5cbi8qKlxuICogRXhwb3J0cyBrZXkgYXMgYSB2YWxpZCBKV0sgb2JqZWN0XG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhwb3J0SndrIChrZXk6IENyeXB0b0tleSk6IFByb21pc2U8SnNvbldlYktleT4ge1xuICBpZiAoIWtleS5leHRyYWN0YWJsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQga2V5IGlzIG5vdCBleHRyYWN0YWJsZS4gQ29uc2lkZXIgcGFzc2luZyB0aGUgZXh0cmFjdGFibGUgYXJndW1lbnQgdG8gZ2VuZXJhdGVLZXkgb3IgaW1wb3J0S2V5IG1ldGhvZCBpZiB5b3UgbmVlZCB0byBleHRyYWN0IHRoZSBrZXknKVxuICB9XG4gIHJldHVybiBhd2FpdCBjcnlwdG8uc3VidGxlLmV4cG9ydEtleSgnandrJywga2V5KVxufVxuXG4vKipcbiAqIEltcG9ydHMga2V5IGRlZmluZWQgaW4gYSBKV0sgb2JqZWN0IG9yIGEgYnVmZmVyXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gZXh0cmFjdGFibGUgLSBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIGl0IHdpbGwgYmUgcG9zc2libGUgdG8gZXhwb3J0IHRoZSBpbXBvcnRlZCBrZXkgdXNpbmcge0BsaW5rIGV4cG9ydEp3a31cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbXBvcnRLZXkgKGtleTogSnNvbldlYktleSB8IEFycmF5QnVmZmVyTGlrZSB8IFR5cGVkQXJyYXkgfCBCdWZmZXIsIGV4dHJhY3RhYmxlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPENyeXB0b0tleT4ge1xuICBpZiAoKGtleSBhcyBBcnJheUJ1ZmZlckxpa2UgfCBUeXBlZEFycmF5IHwgQnVmZmVyKS5ieXRlTGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYXdhaXQgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoJ3JhdycsIGtleSBhcyBCdWZmZXJTb3VyY2UsIHtcbiAgICAgIG5hbWU6ICdBRVMtR0NNJ1xuICAgIH0sIGV4dHJhY3RhYmxlLCBbJ2VuY3J5cHQnLCAnZGVjcnlwdCddKVxuICB9XG4gIHJldHVybiBhd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgnandrJywga2V5IGFzIEpzb25XZWJLZXksIHtcbiAgICBuYW1lOiAnQUVTLUdDTSdcbiAgfSwgZXh0cmFjdGFibGUsIFsnZW5jcnlwdCcsICdkZWNyeXB0J10pXG59XG5cbi8qKlxuICogRW5jcnlwdHMgcGxhaW50ZXh0IHdpdGgga2V5XG4gKiBAcGFyYW0gcGxhaW50ZXh0XG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5jcnlwdCAocGxhaW50ZXh0OiBBcnJheUJ1ZmZlckxpa2UgfCBUeXBlZEFycmF5IHwgQnVmZmVyLCBrZXk6IENyeXB0b0tleSwgaXY6IEFycmF5QnVmZmVyTGlrZSB8IFR5cGVkQXJyYXkgfCBCdWZmZXIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSkpOiBQcm9taXNlPENpcGhlcnRleHQ+IHtcbiAgY29uc3QgYWVzR2NtUGFyYW1zOiBBZXNHY21QYXJhbXMgPSB7XG4gICAgbmFtZTogJ0FFUy1HQ00nLFxuICAgIGl2XG4gIH1cbiAgY29uc3QgZW5jcnlwdGVkID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5lbmNyeXB0KGFlc0djbVBhcmFtcywga2V5LCBwbGFpbnRleHQpXG4gIHJldHVybiBuZXcgQ2lwaGVydGV4dChlbmNyeXB0ZWQsIGl2KVxufVxuXG4vKipcbiAqIERlY3J5cHRzIGNpcGhlcnRleHQuZW5jcnlwdGVkIHVzaW5nIElWIGluIGNpcGhlcnRleHQuaXYgYW5kIHByb3ZpZGVkIGtleVxuICogQHBhcmFtIGNpcGhlcnRleHQgLSBhIHtAbGluayBDaXBoZXJ0ZXh0fSBvYmplY3QsIG9yIGl0cyBKU09OIGVxdWl2YWxlbnQge0BsaW5rIENpcGhlcnRleHRKc29ufSBvciBhIHN0cmluZyB0aGF0IGNhbiBiZSBKU09OLnBhcnNlZCB0byBhIHtAbGluayBDaXBoZXJ0ZXh0SnNvbn1cbiAqIEBwYXJhbSBrZXlcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWNyeXB0IChjaXBoZXJ0ZXh0OiBDaXBoZXJ0ZXh0IHwgQ2lwaGVydGV4dEpzb24gfCBzdHJpbmcsIGtleTogQ3J5cHRvS2V5KTogUHJvbWlzZTxBcnJheUJ1ZmZlcj4ge1xuICBjb25zdCBjID0gKGNpcGhlcnRleHQgaW5zdGFuY2VvZiBDaXBoZXJ0ZXh0KSA/IGNpcGhlcnRleHQgOiBDaXBoZXJ0ZXh0LmZyb21KU09OKGNpcGhlcnRleHQpXG4gIGNvbnN0IGFlc0djbVBhcmFtczogQWVzR2NtUGFyYW1zID0geyBuYW1lOiAnQUVTLUdDTScsIGl2OiBjLml2IH1cbiAgcmV0dXJuIGF3YWl0IGNyeXB0by5zdWJ0bGUuZGVjcnlwdChhZXNHY21QYXJhbXMsIGtleSwgYy5lbmNyeXB0ZWQpXG59XG4iXSwibmFtZXMiOlsiY3J5cHRvIl0sIm1hcHBpbmdzIjoiOzs7TUFZYSxVQUFVLENBQUE7SUFJckIsV0FBYSxDQUFBLFNBQWdELEVBQUUsRUFBeUMsRUFBQTtBQUN0RyxRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLFFBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxF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
