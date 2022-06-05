import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ethers } from "ethers";


function App() {

  const [walletAddress, ssetWalletAddress] = useState("");

  async function requestAccount() {
    console.log('Requesting account. ');

    // Check if Metamask exists
    if (window.ethereum) {
      console.log('Metamask detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        console.log(accounts);
        ssetWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting....');
      }

    } else {
      console.log('Metamask not detected');
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const signer = provider.getSigner();
      const signature = await signer.signMessage('something');
      const address = await signer.getAddress();

      console.log('signature', signature);

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={connectWallet}
        >Connect Wallet</button>
        <h3>Wallet Address: {walletAddress}</h3>
      </header>
    </div>
  );
}

export default App;
