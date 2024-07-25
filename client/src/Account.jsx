import { useState } from 'react';
import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { getRandomBytesSync } from 'ethereum-cryptography/random.js';
import { toHex } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Account({ account, setAccount }) {
  async function createAccount() {
    // DEV: Client side generate of private key thus server have 0 knowledge of.
    const {
      address,
      pubKeyHex: publicKey,
      privKeyHex: privateKey,
    } = generateKey();
    setAccount({ address, publicKey, privateKey });

    await server.post('account', {
      address,
    });
  }

  function generateKey() {
    const privKey = getRandomBytesSync(32);
    const pubKey = secp256k1.getPublicKey(privKey, true);
    const privKeyHex = toHex(privKey);
    const pubKeyHex = toHex(pubKey);
    const address = getAddress(pubKey);
    return { address, pubKeyHex, privKeyHex };
  }

  function getAddress(publicKey) {
    // DEV: ETH style address derive.
    const hash = keccak256(publicKey);
    const address = hash.slice(-20);
    return `0x${toHex(address)}`;
  }

  return (
    <div className="container account">
      <h1>Account</h1>
      <input
        type="submit"
        className="button"
        value="Transfer"
        onClick={createAccount}
      />
      <div className="balance">Address: {account.address}</div>
      <div className="balance">Public key: {account.publicKey}</div>
      <div className="balance">Private key: {account.privateKey}</div>
    </div>
  );
}

export default Account;
