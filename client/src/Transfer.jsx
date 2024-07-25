import { useState } from 'react';
import server from './server';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { hexToBytes, toHex, utf8ToBytes } from 'ethereum-cryptography/utils.js';

function Transfer({ address, setBalance, account }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const tx = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };
      console.log({ tx });

      const txHash = keccak256(utf8ToBytes(JSON.stringify(tx)));
      console.log({ txHash });

      const signature = secp256k1.sign(txHash, hexToBytes(account.privateKey));
      console.log({ signature });
      const jsonString = JSON.stringify(signature, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
      console.log('test');

      const {
        data: { balance },
      } = await server.post(`send`, {
        ...tx,
        signature: toHex(utf8ToBytes(jsonString)),
      });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
