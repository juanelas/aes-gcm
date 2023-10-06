import { encode, decode } from '@juanelas/base64'

/**
 * A TypedArray object describes an array-like view of an underlying binary data buffer.
 */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array

export interface CiphertextJson {
  encrypted: string // base64url with no padding
  iv: string // base64url with no padding
}

export class Ciphertext {
  encrypted: ArrayBufferLike | TypedArray | Buffer
  iv: ArrayBufferLike | TypedArray | Buffer

  constructor (encrypted: ArrayBufferLike | TypedArray | Buffer, iv: ArrayBufferLike | TypedArray | Buffer) {
    this.encrypted = encrypted
    this.iv = iv
  }

  toJSON (): CiphertextJson {
    const ciphertext = {
      encrypted: encode(this.encrypted, true, false),
      iv: encode(this.iv, true, false)
    }
    return ciphertext
  }

  static fromJSON (json: CiphertextJson | string): Ciphertext {
    const cJson = (typeof json === 'string') ? JSON.parse(json) : json
    return new Ciphertext(decode(cJson.encrypted), decode(cJson.iv))
  }
}
