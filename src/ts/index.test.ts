import * as aesGcm from '#pkg'

describe('aes-gcm', function () {
  let jwk: JsonWebKey
  let key: CryptoKey
  it('should generate keys and export them as JWK', async function () {
    const bitLengths = IS_BROWSER ? [128, 256] : [128, 192, 256]
    for (const bitLength of bitLengths) {
      const key = await aesGcm.generateKey(bitLength as aesGcm.aesKeyLength, true)
      jwk = await aesGcm.exportJwk(key)
      chai.expect(jwk.alg).to.equal(`A${bitLength}GCM`)
    }
  })
  it('should not generate key if wrong bitlength', async function () {
    try {
      await aesGcm.generateKey(133 as aesGcm.aesKeyLength, false)
      chai.expect(true).to.equal(false)
    } catch (error) {
      chai.expect(true).to.equal(true)
    }
  })
  it('should not be able to extract key if it was not created with extractable set to true', async function () {
    const key = await aesGcm.generateKey(128)
    try {
      await aesGcm.exportJwk(key)
      chai.expect(true).to.equal(false)
    } catch (error) {
      chai.expect(true).to.equal(true)
    }
  })
  it('should be able to derive key from password', async function () {
    key = (await aesGcm.deriveKey('mysuperpassword')).key
    chai.expect(key.extractable).to.equal(false)

    key = (await aesGcm.deriveKey('mysuperpassword2', 128, true)).key
    chai.expect(key.extractable).to.equal(true)

    key = (await aesGcm.deriveKey('mysuperpassword2', 256, true, { hash: 'SHA-512', iterations: 2, salt: new Uint8Array(16) })).key
    chai.expect(key.extractable).to.equal(true)

    key = (await aesGcm.deriveKey('mysuperpassword2', 256, false, { })).key
    chai.expect(key.extractable).to.equal(false)
  })
  it('should de able to import jwk', async function () {
    key = await aesGcm.importKey(jwk)
    chai.expect(key.extractable).to.equal(false)
  })
  it('should de able to import a raw (buffer) key', async function () {
    const rawKey = crypto.getRandomValues(new Uint8Array(16))
    key = await aesGcm.importKey(rawKey)
    chai.expect(key.extractable).to.equal(false)
  })
  it('should pass the proof of correctness: m==D(E(m))', async function () {
    const plaintext = 'my-plaintext-msg'
    const m = (new TextEncoder()).encode(plaintext)
    const c = await aesGcm.encrypt(m, key)
    const cJson = JSON.parse(JSON.stringify(c))
    const c2 = aesGcm.Ciphertext.fromJSON(JSON.stringify(c))
    const d = await aesGcm.decrypt(c, key)
    const d2 = await aesGcm.decrypt(cJson, key)
    const d3 = await aesGcm.decrypt(c2, key)
    chai.expect((new TextDecoder()).decode(d)).to.equal(plaintext)
    chai.expect((new TextDecoder()).decode(d)).to.equal((new TextDecoder()).decode(d2))
    chai.expect((new TextDecoder()).decode(d)).to.equal((new TextDecoder()).decode(d3))
  })
})
