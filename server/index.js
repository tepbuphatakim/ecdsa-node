import express from "express";
import cors from "cors";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { parseBigIntObj } from "./utils/serialize.js";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};
// DEV: Basic nonce to prevent replay attacks of transaction.
// Since digital signature provide proof of authenticate the
// address/public key without the knowledge of private key but
// attacker can still used the valid signature of previous
// transaction to re-send to the transaction which is called
// 'replay attack'. This nonce will prevent this by ensure each
// transaction has unique nonce attach to the transaction validate
// by the nonce.
const nonces = [];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nonce", (req, res) => {
  res.send({ nonce: nonces.length });
});

app.post("/send", (req, res) => {
  const { transaction, signature } = req.body;
  const { sender, recipient, amount, publicKey, nonce } = transaction;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  const txHash = keccak256(utf8ToBytes(JSON.stringify(transaction)));
  const signatureUtf8 = new TextDecoder().decode(hexToBytes(signature));
  const signatureObj = parseBigIntObj(signatureUtf8);
  const validSignature = secp256k1.verify(signatureObj, txHash, publicKey);
  if (!validSignature) {
    return res.status(400).send({ message: "Invalid signature." });
  }
  if (nonces.includes(nonce)) {
    return res
      .status(400)
      .send({ message: "Transaction mark as replay attack!" });
  }
  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;
  nonces.push(nonce);
  return res.send({ balance: balances[sender] });
});

app.post("/account", (req, res) => {
  const { address } = req.body;
  // DEV: Airdrop 100 to newly address created.
  balances[address] = 100;
  res.send({ address, balance: balances[address] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
