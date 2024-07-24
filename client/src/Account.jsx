import { useState } from 'react';
import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { getRandomBytesSync } from 'ethereum-cryptography/random.js';
import { toHex } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Account() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  async function createAccount() {
    // DEV: Client side generate of private key thus server have 0 knowledge of.
    const privKey = getRandomBytesSync(32);
    const privKeyHex = toHex(privKey);
    const pubKeyHex = toHex(secp256k1.getPublicKey(privKey, true));
    setPrivateKey(privKeyHex);
    setPublicKey(pubKeyHex);

    const {
      data: { address, balance },
    } = await server.post('account', {
      address: pubKeyHex,
    });
    console.log(address, balance);
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

      <div className="balance">Public key: {publicKey}</div>
      <div className="balance">Private key: {privateKey}</div>
    </div>
  );
}

export default Account;
