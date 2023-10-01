# @juanelas/aes-gcm - v1.0.0

## Table of contents

### Interfaces

- [Ciphertext](interfaces/Ciphertext.md)

### Type Aliases

- [AesKeyLength](API.md#aeskeylength)

### Functions

- [decrypt](API.md#decrypt)
- [encrypt](API.md#encrypt)
- [exportJwk](API.md#exportjwk)
- [generateKey](API.md#generatekey)
- [importKey](API.md#importkey)

## Type Aliases

### AesKeyLength

Ƭ **AesKeyLength**: ``128`` \| ``192`` \| ``256``

## Functions

### decrypt

▸ **decrypt**(`ciphertext`, `key`): `Promise`<`ArrayBuffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ciphertext` | [`Ciphertext`](interfaces/Ciphertext.md) |
| `key` | `CryptoKey` |

#### Returns

`Promise`<`ArrayBuffer`\>

___

### encrypt

▸ **encrypt**(`plaintext`, `key`): `Promise`<[`Ciphertext`](interfaces/Ciphertext.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `plaintext` | `BufferSource` |
| `key` | `CryptoKey` |

#### Returns

`Promise`<[`Ciphertext`](interfaces/Ciphertext.md)\>

___

### exportJwk

▸ **exportJwk**(`key`): `Promise`<`JsonWebKey`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `CryptoKey` |

#### Returns

`Promise`<`JsonWebKey`\>

___

### generateKey

▸ **generateKey**(`bitLength?`, `extractable?`): `Promise`<`CryptoKey`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `bitLength` | `number` | `256` |
| `extractable` | `boolean` | `false` |

#### Returns

`Promise`<`CryptoKey`\>

___

### importKey

▸ **importKey**(`key`, `extractable?`): `Promise`<`CryptoKey`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `JsonWebKey` \| `BufferSource` | `undefined` |
| `extractable` | `boolean` | `false` |

#### Returns

`Promise`<`CryptoKey`\>
