import './App.css';
import { useEffect, useState } from 'react'

function App() {

  const [currentAccount, setCurrentAccount] = useState("")

  const contractAddress = "0xBE13b9b9b73AC19F5a390dbA2dE6fEe5F2B696A5"

  const checkIfWalletIsConnected = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not found")
        return;
      }
      else
        console.log("we have etherium object", ethereum);

      const accounts = await ethereum.request({ method: "eth_accounts" });  //check if there are accounts connected to the site

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      }
      else {
        console.log("No authorized accounts found!");
      }

    } catch (error) {
      console.log(error);
    }
  }


  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }); // request connection with accounts
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();

  }, [])





  return (
    <div className="App">
      <h2>Decentralized Voting System</h2>

      <button onClick={connectWallet}>Connect Wallet</button>
      <h4>{currentAccount}</h4>
    </div>
  );
}

export default App;
