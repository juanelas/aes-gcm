import * as aesGcm from '#pkg'

describe('aes-gcm', function () {
  let jwk: JsonWebKey
  let key: CryptoKey
  it('should generate keys and export them as JWK', async function () {
    const bitLengths = IS_BROWSER ? [128, 256] : [128, 192, 256]
    for (const bitLength of bitLengths) {
      const key = await aesGcm.generateKey(bitLength, true)
      jwk = await aesGcm.exportJwk(key)
      chai.expect(jwk.alg).to.equal(`A${bitLength}GCM`)
    }
  })
  it('should not generate key if wrong bitlength', async function () {
    try {
      await aesGcm.generateKey(133, false)
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
    const d = await aesGcm.decrypt(c, key)
    chai.expect((new TextDecoder()).decode(d)).to.equal(plaintext)
  })
})
