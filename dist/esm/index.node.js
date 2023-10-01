import { webcrypto } from 'crypto';

async function generateKey(bitLength = 256, extractable = false) {
    const aesGcmParams = {
        name: 'AES-GCM',
        length: bitLength
    };
    return await webcrypto.subtle.generateKey(aesGcmParams, extractable, ['encrypt', 'decrypt']);
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
async function encrypt(plaintext, key) {
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const aesGcmParams = {
        name: 'AES-GCM',
        iv
    };
    const encrypted = await webcrypto.subtle.encrypt(aesGcmParams, key, plaintext);
    return {
        encrypted,
        iv
    };
}
async function decrypt(ciphertext, key) {
    const aesGcmParams = { name: 'AES-GCM', iv: ciphertext.iv };
    return await webcrypto.subtle.decrypt(aesGcmParams, key, ciphertext.encrypted);
}

export { decrypt, encrypt, exportJwk, generateKey, importKey };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJjcnlwdG8iXSwibWFwcGluZ3MiOiI7O0FBRU8sZUFBZSxXQUFXLENBQUUsU0FBb0IsR0FBQSxHQUFHLEVBQUUsV0FBQSxHQUF1QixLQUFLLEVBQUE7QUFDdEYsSUFBQSxNQUFNLFlBQVksR0FBb0I7QUFDcEMsUUFBQSxJQUFJLEVBQUUsU0FBUztBQUNmLFFBQUEsTUFBTSxFQUFFLFNBQVM7S0FDbEIsQ0FBQTtBQUNELElBQUEsT0FBTyxNQUFNQSxTQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDM0YsQ0FBQztBQUVNLGVBQWUsU0FBUyxDQUFFLEdBQWMsRUFBQTtBQUM3QyxJQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFFBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyw4SUFBOEksQ0FBQyxDQUFBO0FBQ2hLLEtBQUE7SUFDRCxPQUFPLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNsRCxDQUFDO0FBRU0sZUFBZSxTQUFTLENBQUUsR0FBOEIsRUFBRSxjQUF1QixLQUFLLEVBQUE7QUFDM0YsSUFBQSxJQUFLLEdBQW1CLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtRQUNqRCxPQUFPLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFtQixFQUFFO0FBQy9ELFlBQUEsSUFBSSxFQUFFLFNBQVM7U0FDaEIsRUFBRSxXQUFXLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUN4QyxLQUFBO0lBQ0QsT0FBTyxNQUFNQSxTQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBaUIsRUFBRTtBQUM3RCxRQUFBLElBQUksRUFBRSxTQUFTO0tBQ2hCLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDekMsQ0FBQztBQU9NLGVBQWUsT0FBTyxDQUFFLFNBQXVCLEVBQUUsR0FBYyxFQUFBO0FBQ3BFLElBQUEsTUFBTSxFQUFFLEdBQUdBLFNBQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNyRCxJQUFBLE1BQU0sWUFBWSxHQUFpQjtBQUNqQyxRQUFBLElBQUksRUFBRSxTQUFTO1FBQ2YsRUFBRTtLQUNILENBQUE7QUFDRCxJQUFBLE1BQU0sU0FBUyxHQUFHLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDM0UsT0FBTztRQUNMLFNBQVM7UUFDVCxFQUFFO0tBQ0gsQ0FBQTtBQUNILENBQUM7QUFFTSxlQUFlLE9BQU8sQ0FBRSxVQUFzQixFQUFFLEdBQWMsRUFBQTtBQUNuRSxJQUFBLE1BQU0sWUFBWSxHQUFpQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN6RSxJQUFBLE9BQU8sTUFBTUEsU0FBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0U7Ozs7In0=
