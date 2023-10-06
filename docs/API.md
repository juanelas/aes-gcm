# @juanelas/aes-gcm - v1.0.1

## Table of contents

### Classes

- [Ciphertext](classes/Ciphertext.md)

### Interfaces

- [CiphertextJson](interfaces/CiphertextJson.md)
- [DerivedKey](interfaces/DerivedKey.md)

### Type Aliases

- [Pbkdf2Parameters](API.md#pbkdf2parameters)
- [TypedArray](API.md#typedarray)
- [aesKeyLength](API.md#aeskeylength)

### Functions

- [decrypt](API.md#decrypt)
- [deriveKey](API.md#derivekey)
- [encrypt](API.md#encrypt)
- [exportJwk](API.md#exportjwk)
- [generateKey](API.md#generatekey)
- [importKey](API.md#importkey)

## Type Aliases

### Pbkdf2Parameters

Ƭ **Pbkdf2Parameters**: `Partial`<`Omit`<`Pbkdf2Params`, ``"name"``\>\>

___

### TypedArray

Ƭ **TypedArray**: `Int8Array` \| `Uint8Array` \| `Uint8ClampedArray` \| `Int16Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array` \| `Float64Array` \| `BigInt64Array` \| `BigUint64Array`

A TypedArray object describes an array-like view of an underlying binary data buffer.

___

### aesKeyLength

Ƭ **aesKeyLength**: ``128`` \| ``192`` \| ``256``

## Functions

### decrypt

▸ **decrypt**(`ciphertext`, `key`): `Promise`<`ArrayBuffer`\>

Decrypts ciphertext.encrypted using IV in ciphertext.iv and provided key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ciphertext` | `string` \| [`CiphertextJson`](interfaces/CiphertextJson.md) \| [`Ciphertext`](classes/Ciphertext.md) | a [Ciphertext](classes/Ciphertext.md) object, or its JSON equivalent [CiphertextJson](interfaces/CiphertextJson.md) or a string that can be JSON.parsed to a [CiphertextJson](interfaces/CiphertextJson.md) |
| `key` | `CryptoKey` |  |

#### Returns

`Promise`<`ArrayBuffer`\>

___

### deriveKey

▸ **deriveKey**(`password`, `bitLength?`, `extractable?`, `pbkdf2Params?`): `Promise`<[`DerivedKey`](interfaces/DerivedKey.md)\>

Derives an AES-GCM key from a password. It internally uses PBKDF2.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `password` | `string` | `undefined` | a string containing a password |
| `bitLength` | [`aesKeyLength`](API.md#aeskeylength) | `256` | the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments |
| `extractable` | `boolean` | `false` | a boolean value indicating whether it will be possible to export the key using [exportJwk](API.md#exportjwk) |
| `pbkdf2Params` | `Partial`<`Omit`<`Pbkdf2Params`, ``"name"``\>\> | `undefined` | Overwrite PBKDF2 parameters (hash, iterations, salt) |

#### Returns

`Promise`<[`DerivedKey`](interfaces/DerivedKey.md)\>

A cryptoKey object along with the salt that was used to generate it

___

### encrypt

▸ **encrypt**(`plaintext`, `key`, `iv?`): `Promise`<[`Ciphertext`](classes/Ciphertext.md)\>

Encrypts plaintext with key

#### Parameters

| Name | Type |
| :------ | :------ |
| `plaintext` | [`TypedArray`](API.md#typedarray) \| `ArrayBufferLike` \| `Buffer` |
| `key` | `CryptoKey` |
| `iv` | [`TypedArray`](API.md#typedarray) \| `ArrayBufferLike` \| `Buffer` |

#### Returns

`Promise`<[`Ciphertext`](classes/Ciphertext.md)\>

___

### exportJwk

▸ **exportJwk**(`key`): `Promise`<`JsonWebKey`\>

Exports key as a valid JWK object

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `CryptoKey` |

#### Returns

`Promise`<`JsonWebKey`\>

___

### generateKey

▸ **generateKey**(`bitLength?`, `extractable?`): `Promise`<`CryptoKey`\>

Generates new key for AES-GCM

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `bitLength` | [`aesKeyLength`](API.md#aeskeylength) | `256` | the length in bits of the key to generate. This must be one of: 128, 192, or 256, although 192 many not be suppoted in some environments |
| `extractable` | `boolean` | `false` | a boolean value indicating whether it will be possible to export the key using [exportJwk](API.md#exportjwk) |

#### Returns

`Promise`<`CryptoKey`\>

___

### importKey

▸ **importKey**(`key`, `extractable?`): `Promise`<`CryptoKey`\>

Imports key defined in a JWK object or a buffer

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | [`TypedArray`](API.md#typedarray) \| `ArrayBufferLike` \| `Buffer` \| `JsonWebKey` | `undefined` |  |
| `extractable` | `boolean` | `false` | a boolean value indicating whether it will be possible to export the imported key using [exportJwk](API.md#exportjwk) |

#### Returns

`Promise`<`CryptoKey`\>
