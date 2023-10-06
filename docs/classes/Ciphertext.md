# Class: Ciphertext

## Table of contents

### Constructors

- [constructor](Ciphertext.md#constructor)

### Properties

- [encrypted](Ciphertext.md#encrypted)
- [iv](Ciphertext.md#iv)

### Methods

- [toJSON](Ciphertext.md#tojson)
- [fromJSON](Ciphertext.md#fromjson)

## Constructors

### constructor

• **new Ciphertext**(`encrypted`, `iv`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `encrypted` | [`TypedArray`](../API.md#typedarray) \| `ArrayBufferLike` \| `Buffer` |
| `iv` | [`TypedArray`](../API.md#typedarray) \| `ArrayBufferLike` \| `Buffer` |

## Properties

### encrypted

• **encrypted**: [`TypedArray`](../API.md#typedarray) \| `ArrayBufferLike` \| `Buffer`

___

### iv

• **iv**: [`TypedArray`](../API.md#typedarray) \| `ArrayBufferLike` \| `Buffer`

## Methods

### toJSON

▸ **toJSON**(): [`CiphertextJson`](../interfaces/CiphertextJson.md)

#### Returns

[`CiphertextJson`](../interfaces/CiphertextJson.md)

___

### fromJSON

▸ `Static` **fromJSON**(`json`): [`Ciphertext`](Ciphertext.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `string` \| [`CiphertextJson`](../interfaces/CiphertextJson.md) |

#### Returns

[`Ciphertext`](Ciphertext.md)
