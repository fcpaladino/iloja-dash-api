import app from "../config/app";

export function encryptValue(value, token = null) {
  let chave = app.tokenCrypto;
  if(token) chave = token;
  if(!value) return null;
  const CryptoJS = require("crypto-js");
  const encrypted = CryptoJS.AES.encrypt(value, chave);
  return encrypted.toString();
}
export function decryptValue(encryptedString, token = null) {
  let chave = app.tokenCrypto;
  if(token) chave = token;
  if(!encryptedString) return null;
  const CryptoJS = require("crypto-js");
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, chave);
  const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}
