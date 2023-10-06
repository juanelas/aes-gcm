var aesGcm=function(e){"use strict";function t(e,t=!1,r=!0){let n="";n=(e=>{const t=[];for(let r=0;r<e.length;r+=32768)t.push(String.fromCharCode.apply(null,e.subarray(r,r+32768)));return btoa(t.join(""))})("string"==typeof e?(new TextEncoder).encode(e):new Uint8Array(e));return t&&(n=function(e){return e.replace(/\+/g,"-").replace(/\//g,"_")}(n)),r||(n=n.replace(/=/g,"")),n}function r(e,t=!1){{let r=!1;if(/^[0-9a-zA-Z_-]+={0,2}$/.test(e))r=!0;else if(!/^[0-9a-zA-Z+/]*={0,2}$/.test(e))throw new Error("Not a valid base64 input");r&&(e=e.replace(/-/g,"+").replace(/_/g,"/").replace(/=/g,""));const n=new Uint8Array(atob(e).split("").map((e=>e.charCodeAt(0))));return t?(new TextDecoder).decode(n):n}}class n{constructor(e,t){this.encrypted=e,this.iv=t}toJSON(){return{encrypted:t(this.encrypted,!0,!1),iv:t(this.iv,!0,!1)}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;return new n(r(t.encrypted),r(t.iv))}}return e.Ciphertext=n,e.decrypt=async function(e,t){const r=e instanceof n?e:n.fromJSON(e),a={name:"AES-GCM",iv:r.iv};return await crypto.subtle.decrypt(a,t,r.encrypted)},e.deriveKey=async function(e,t=256,r=!1,n={hash:"SHA-256",iterations:1e5,salt:crypto.getRandomValues(new Uint8Array(16))}){void 0===n.hash&&(n.hash="SHA-256"),void 0===n.iterations&&(n.iterations=1e5),void 0===n.salt&&(n.salt=crypto.getRandomValues(new Uint8Array(16)));const a={name:"PBKDF2",...n},o=await crypto.subtle.importKey("raw",(new TextEncoder).encode(e),"PBKDF2",!1,["deriveKey"]);return{key:await crypto.subtle.deriveKey(a,o,{name:"AES-GCM",length:t},r,["encrypt","decrypt"]),salt:a.salt}},e.encrypt=async function(e,t,r=crypto.getRandomValues(new Uint8Array(16))){const a={name:"AES-GCM",iv:r},o=await crypto.subtle.encrypt(a,t,e);return new n(o,r)},e.exportJwk=async function(e){if(!e.extractable)throw new Error("Provided key is not extractable. Consider passing the extractable argument to generateKey or importKey method if you need to extract the key");return await crypto.subtle.exportKey("jwk",e)},e.generateKey=async function(e=256,t=!1){const r={name:"AES-GCM",length:e};return await crypto.subtle.generateKey(r,t,["encrypt","decrypt"])},e.importKey=async function(e,t=!1){return void 0!==e.byteLength?await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},t,["encrypt","decrypt"]):await crypto.subtle.importKey("jwk",e,{name:"AES-GCM"},t,["encrypt","decrypt"])},e}({});
