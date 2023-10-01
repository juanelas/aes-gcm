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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubm9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RzL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIEFlc0tleUxlbmd0aCA9IDEyOCB8IDE5MiB8IDI1NlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVLZXkgKGJpdExlbmd0aDogbnVtYmVyID0gMjU2LCBleHRyYWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxDcnlwdG9LZXk+IHtcbiAgY29uc3QgYWVzR2NtUGFyYW1zOiBBZXNLZXlHZW5QYXJhbXMgPSB7XG4gICAgbmFtZTogJ0FFUy1HQ00nLFxuICAgIGxlbmd0aDogYml0TGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGF3YWl0IGNyeXB0by5zdWJ0bGUuZ2VuZXJhdGVLZXkoYWVzR2NtUGFyYW1zLCBleHRyYWN0YWJsZSwgWydlbmNyeXB0JywgJ2RlY3J5cHQnXSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4cG9ydEp3ayAoa2V5OiBDcnlwdG9LZXkpOiBQcm9taXNlPEpzb25XZWJLZXk+IHtcbiAgaWYgKCFrZXkuZXh0cmFjdGFibGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGVkIGtleSBpcyBub3QgZXh0cmFjdGFibGUuIENvbnNpZGVyIHBhc3NpbmcgdGhlIGV4dHJhY3RhYmxlIGFyZ3VtZW50IHRvIGdlbmVyYXRlS2V5IG9yIGltcG9ydEtleSBtZXRob2QgaWYgeW91IG5lZWQgdG8gZXh0cmFjdCB0aGUga2V5JylcbiAgfVxuICByZXR1cm4gYXdhaXQgY3J5cHRvLnN1YnRsZS5leHBvcnRLZXkoJ2p3aycsIGtleSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGltcG9ydEtleSAoa2V5OiBKc29uV2ViS2V5IHwgQnVmZmVyU291cmNlLCBleHRyYWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxDcnlwdG9LZXk+IHtcbiAgaWYgKChrZXkgYXMgQXJyYXlCdWZmZXIpLmJ5dGVMZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBhd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgncmF3Jywga2V5IGFzIEJ1ZmZlclNvdXJjZSwge1xuICAgICAgbmFtZTogJ0FFUy1HQ00nXG4gICAgfSwgZXh0cmFjdGFibGUsIFsnZW5jcnlwdCcsICdkZWNyeXB0J10pXG4gIH1cbiAgcmV0dXJuIGF3YWl0IGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KCdqd2snLCBrZXkgYXMgSnNvbldlYktleSwge1xuICAgIG5hbWU6ICdBRVMtR0NNJ1xuICB9LCBleHRyYWN0YWJsZSwgWydlbmNyeXB0JywgJ2RlY3J5cHQnXSlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaXBoZXJ0ZXh0IHtcbiAgZW5jcnlwdGVkOiBBcnJheUJ1ZmZlclxuICBpdjogVWludDhBcnJheVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5jcnlwdCAocGxhaW50ZXh0OiBCdWZmZXJTb3VyY2UsIGtleTogQ3J5cHRvS2V5KTogUHJvbWlzZTxDaXBoZXJ0ZXh0PiB7XG4gIGNvbnN0IGl2ID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxMikpXG4gIGNvbnN0IGFlc0djbVBhcmFtczogQWVzR2NtUGFyYW1zID0ge1xuICAgIG5hbWU6ICdBRVMtR0NNJyxcbiAgICBpdlxuICB9XG4gIGNvbnN0IGVuY3J5cHRlZCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZW5jcnlwdChhZXNHY21QYXJhbXMsIGtleSwgcGxhaW50ZXh0KVxuICByZXR1cm4ge1xuICAgIGVuY3J5cHRlZCxcbiAgICBpdlxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWNyeXB0IChjaXBoZXJ0ZXh0OiBDaXBoZXJ0ZXh0LCBrZXk6IENyeXB0b0tleSk6IFByb21pc2U8QXJyYXlCdWZmZXI+IHtcbiAgY29uc3QgYWVzR2NtUGFyYW1zOiBBZXNHY21QYXJhbXMgPSB7IG5hbWU6ICdBRVMtR0NNJywgaXY6IGNpcGhlcnRleHQuaXYgfVxuICByZXR1cm4gYXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KGFlc0djbVBhcmFtcywga2V5LCBjaXBoZXJ0ZXh0LmVuY3J5cHRlZClcbn1cbiJdLCJuYW1lcyI6WyJjcnlwdG8iXSwibWFwcGluZ3MiOiI7O0FBRU8sZUFBZSxXQUFXLENBQUUsU0FBb0IsR0FBQSxHQUFHLEVBQUUsV0FBQSxHQUF1QixLQUFLLEVBQUE7QUFDdEYsSUFBQSxNQUFNLFlBQVksR0FBb0I7QUFDcEMsUUFBQSxJQUFJLEVBQUUsU0FBUztBQUNmLFFBQUEsTUFBTSxFQUFFLFNBQVM7S0FDbEIsQ0FBQTtBQUNELElBQUEsT0FBTyxNQUFNQSxTQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDM0YsQ0FBQztBQUVNLGVBQWUsU0FBUyxDQUFFLEdBQWMsRUFBQTtBQUM3QyxJQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFFBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyw4SUFBOEksQ0FBQyxDQUFBO0FBQ2hLLEtBQUE7SUFDRCxPQUFPLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNsRCxDQUFDO0FBRU0sZUFBZSxTQUFTLENBQUUsR0FBOEIsRUFBRSxjQUF1QixLQUFLLEVBQUE7QUFDM0YsSUFBQSxJQUFLLEdBQW1CLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtRQUNqRCxPQUFPLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFtQixFQUFFO0FBQy9ELFlBQUEsSUFBSSxFQUFFLFNBQVM7U0FDaEIsRUFBRSxXQUFXLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUN4QyxLQUFBO0lBQ0QsT0FBTyxNQUFNQSxTQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBaUIsRUFBRTtBQUM3RCxRQUFBLElBQUksRUFBRSxTQUFTO0tBQ2hCLEVBQUUsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7QUFDekMsQ0FBQztBQU9NLGVBQWUsT0FBTyxDQUFFLFNBQXVCLEVBQUUsR0FBYyxFQUFBO0FBQ3BFLElBQUEsTUFBTSxFQUFFLEdBQUdBLFNBQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNyRCxJQUFBLE1BQU0sWUFBWSxHQUFpQjtBQUNqQyxRQUFBLElBQUksRUFBRSxTQUFTO1FBQ2YsRUFBRTtLQUNILENBQUE7QUFDRCxJQUFBLE1BQU0sU0FBUyxHQUFHLE1BQU1BLFNBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDM0UsT0FBTztRQUNMLFNBQVM7UUFDVCxFQUFFO0tBQ0gsQ0FBQTtBQUNILENBQUM7QUFFTSxlQUFlLE9BQU8sQ0FBRSxVQUFzQixFQUFFLEdBQWMsRUFBQTtBQUNuRSxJQUFBLE1BQU0sWUFBWSxHQUFpQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN6RSxJQUFBLE9BQU8sTUFBTUEsU0FBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0U7Ozs7In0=
