[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node.js CI](https://github.com/juanelas/aes-gcm/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/juanelas/aes-gcm/actions/workflows/build-and-test.yml)

# @juanelas/aes-gcm

Easy to use aes-gcm cipher for node.js and browser

## Install and use

`@juanelas/aes-gcm` can be imported to your project with `npm`:

```console
npm install @juanelas/aes-gcm
```

Then either require (Node.js CJS):

```javascript
const aesGcm = require('@juanelas/aes-gcm')
```

or import (JavaScript ES module):

```javascript
import * as aesGcm from '@juanelas/aes-gcm'
```

> The appropriate version for browser or node should be automatically chosen when importing. However, if your bundler does not import the appropriate module version (node esm, node cjs or browser esm), you can force it to use a specific one by just importing one of the followings:
>
> - `@juanelas/aes-gcm/dist/cjs/index.node`: for Node.js CJS module
> - `@juanelas/aes-gcm/dist/esm/index.node`: for Node.js ESM module
> - `@juanelas/aes-gcm/dist/esm/index.browser`: for browser ESM module
>
> If you are coding TypeScript, types will not be automatically detected when using the specific versions. You can easily get the types in by creating adding to a types declaration file (`.d.ts`) the following line:
>
> ```typescript
> declare module '@juanelas/aes-gcm/dist/esm/index.browser' // use the specific file you were importing
> ```

You can also download the [IIFE bundle](https://raw.githubusercontent.com/juanelas/aes-gcm/main/dist/bundle.iife.js), the [ESM bundle](https://raw.githubusercontent.com/juanelas/aes-gcm/main/dist/esm/bundle.min.js) or the [UMD bundle](https://raw.githubusercontent.com/juanelas/aes-gcm/main/dist/bundle.umd.js) and manually add it to your project, or, if you have already installed `@juanelas/aes-gcm` in your project, just get the bundles from `node_modules/@juanelas/aes-gcm/dist/bundles/`.

## Usage example

```typescript
const key = await aesGcm.generateKey(256, false) // create a non-extractable random key of 256 bits

const mStr = 'my-plaintext-msg'
const m = (new TextEncoder()).encode(mStr) // convert to buffer

const c = await aesGcm.encrypt(m, key)

const d = await aesGcm.decrypt(c, key)
const dStr = (new TextDecoder()).decode(d) // convert back to utf-8 string 'my-plaintext-msg'
```

## API reference documentation

[Check the API](docs/API.md)
