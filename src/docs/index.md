[![License: {{PKG_LICENSE}}](https://img.shields.io/badge/License-{{PKG_LICENSE}}-yellow.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{GITHUB_ACTIONS_BADGES}}

# {{PKG_NAME}}

{{PKG_DESCRIPTION}}

In order to facilitate ciphertext exchange (encrypted data and IV), the generated ciphertext object (obtained after encrypting) can be JSON.stringified. The decrypt method accept as well the JSON version of the ciphertext.

## Install

```console
npm install {{PKG_NAME}}
```

## Usage

Either require (Node.js CJS):

```javascript
const {{PKG_CAMELCASE}} = require('{{PKG_NAME}}')
```

or import (TypeScript or JavaScript ES module):

```javascript
import * as {{PKG_CAMELCASE}} from '{{PKG_NAME}}'
```

An example code for encryption and decryption could be:

```typescript
const key = await aesGcm.generateKey(256, false) // create a non-extractable random key of 256 bits

const mStr = 'my-plaintext-msg'
const m = (new TextEncoder()).encode(mStr) // convert to buffer

// encrypt m with key
const c = await aesGcm.encrypt(m, key)

// decrypt c with key
const d = await aesGcm.decrypt(c, key)
const dStr = (new TextDecoder()).decode(d) // convert back to utf-8 string 'my-plaintext-msg'

// to ease ciphertext exchange, you could JSON.stringify it
const cStr = JSON.stringify(c)

 // The JSON.stringified ciphertext can as well be directly decrypted
const d = await aesGcm.decrypt(cStr, key)
const dStr = (new TextDecoder()).decode(d) // convert back to utf-8 string 'my-plaintext-msg'

// If needed, you could recover the Ciphertext object (with iv and encrypted) from cStr
const c2 = aesGcm.Ciphertext.fromJSON(cStr)

```

## API reference documentation

[Check the API](../../docs/API.md)
