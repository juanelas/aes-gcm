'use strict';

var crypto = require('crypto');

async function generateKey(bitLength = 256, extractable = false) {
    const aesGcmParams = {
        name: 'AES-GCM',
        length: bitLength
    };
    return await crypto.webcrypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
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
async function encrypt(plaintext, key) {
    const iv = crypto.webcrypto.getRandomValues(new Uint8Array(12));
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await crypto.webcrypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return {
        encrypted,
        iv
    };
}
async function decrypt(ciphertext, key) {
    const aesGcmParams = { name: 'AES-GCM', iv: ciphertext.iv };
    return await crypto.webcrypto.subtle.decrypt(aesGcmParams, key, ciphertext.encrypted);
}

exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.exportJwk = exportJwk;
exports.generateKey = generateKey;
exports.importKey = importKey;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJjcnlwdG8iXSwibWFwcGluZ3MiOiI7Ozs7QUFFTyxlQUFlLFdBQVcsQ0FBRSxTQUFvQixHQUFBLEdBQUcsRUFBRSxXQUFBLEdBQXVCLEtBQUssRUFBQTtBQUN0RixJQUFBLE1BQU0sWUFBWSxHQUFvQjtBQUNwQyxRQUFBLElBQUksRUFBRSxTQUFTO0FBQ2YsUUFBQSxNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFBO0FBQ0QsSUFBQSxPQUFPLE1BQU1BLGdCQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDM0YsQ0FBQztBQUVNLGVBQWUsU0FBUyxDQUFFLEdBQWMsRUFBQTtBQUM3QyxJQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFFBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyw4SUFBOEksQ0FBQyxDQUFBO0FBQ2hLLEtBQUE7SUFDRCxPQUFPLE1BQU1BLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDbEQsQ0FBQztBQUVNLGVBQWUsU0FBUyxDQUFFLEdBQThCLEVBQUUsY0FBdUIsS0FBSyxFQUFBO0FBQzNGLElBQUEsSUFBSyxHQUFtQixDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDakQsT0FBTyxNQUFNQSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQW1CLEVBQUU7QUFDL0QsWUFBQSxJQUFJLEVBQUUsU0FBUztTQUNoQixFQUFFLFdBQVcsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLEtBQUE7SUFDRCxPQUFPLE1BQU1BLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBaUIsRUFBRTtBQUM3RCxRQUFBLElBQUksRUFBRSxTQUFTO0tBQ2hCLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDekMsQ0FBQztBQU9NLGVBQWUsT0FBTyxDQUFFLFNBQXVCLEVBQUUsR0FBYyxFQUFBO0FBQ3BFLElBQUEsTUFBTSxFQUFFLEdBQUdBLGdCQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckQsSUFBQSxNQUFNLFlBQVksR0FBaUI7QUFDakMsUUFBQSxJQUFJLEVBQUUsU0FBUztRQUNmLEVBQUU7S0FDSCxDQUFBO0FBQ0QsSUFBQSxNQUFNLFNBQVMsR0FBRyxNQUFNQSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUMzRSxPQUFPO1FBQ0wsU0FBUztRQUNULEVBQUU7S0FDSCxDQUFBO0FBQ0gsQ0FBQztBQUVNLGVBQWUsT0FBTyxDQUFFLFVBQXNCLEVBQUUsR0FBYyxFQUFBO0FBQ25FLElBQUEsTUFBTSxZQUFZLEdBQWlCLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3pFLElBQUEsT0FBTyxNQUFNQSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0U7Ozs7Ozs7OyJ9
