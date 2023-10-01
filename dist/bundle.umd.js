!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).aesGcm={})}(this,(function(e){"use strict";e.decrypt=async function(e,t){const n={name:"AES-GCM",iv:e.iv};return await crypto.subtle.decrypt(n,t,e.encrypted)},e.encrypt=async function(e,t){const n=crypto.getRandomValues(new Uint8Array(12)),r={name:"AES-GCM",iv:n};return{encrypted:await crypto.subtle.encrypt(r,t,e),iv:n}},e.exportJwk=async function(e){if(!e.extractable)throw new Error("Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key");return await crypto.subtle.exportKey("jwk",e)},e.generateKey=async function(e=256,t=!1){const n={name:"AES-GCM",length:e};return await crypto.subtle.generateKey(n,t,["encrypt","decrypt"])},e.importKey=async function(e,t=!1){return void 0!==e.byteLength?await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},t,["encrypt","decrypt"]):await crypto.subtle.importKey("jwk",e,{name:"AES-GCM"},t,["encrypt","decrypt"])}}));
