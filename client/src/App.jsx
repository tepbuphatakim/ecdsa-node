import Wallet from './Wallet';
import Transfer from './Transfer';
import Account from './Account';
import './App.scss';
import { useState } from 'react';

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [account, setAccount] = useState({
    address: '',
    publicKey: '',
    privateKey: '',
  });

  return (
    <div className="app">
      <Account account={account} setAccount={setAccount} />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} account={account} />
    </div>
  );
}

export default App;
