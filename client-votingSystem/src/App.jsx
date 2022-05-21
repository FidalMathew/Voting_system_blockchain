import './App.css';
import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import abi from "./utils/VotingSystem.json";

import Admin from './Admin';
import Voter from './Voter';

function App() {
  const [chainId, setChainId] = useState("")

  const [currentAccount, setCurrentAccount] = useState("")
  const [votingSystemContract, setVotingSystemContract] = useState("");

  const [isManager, setIsManager] = useState(false);

  const contractAddress = "0x81466b87db90B679897BA62786c9367E06efCC87"
  const contractABI = abi.abi;
  const { ethereum } = window;


  const checkIfWalletIsConnected = async () => {

    try {

      if (!ethereum) {
        console.log("Metamask not found")
        return;
      }
      else
        console.log("we have etherium object");

      const accounts = await ethereum.request({ method: "eth_accounts" });  //check if there are accounts connected to the site

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        // if (currentAccount !== "")
        setCurrentAccount(account)

        checkIfManager();
        // votingSystem();

      }
      else {
        setCurrentAccount("")
        console.log("No authorized accounts found!");
      }


      const curr_chainId = await ethereum.request({ method: 'eth_chainId' });
      setChainId(curr_chainId)

      ethereum.on('chainChanged', handleChainChanged);


      // Reload the page when they change networks
      function handleChainChanged(_chainId) {
        window.location.reload();
      }

    } catch (error) {
      console.log(error);
    }
  }


  const connectWallet = async () => {
    try {

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }); // request connection with accounts
      // console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // const chainId = await ethereum.request({ method: 'eth_chainId' });

    }
    catch (e) {
      console.log(e);
    }
  }








  const checkIfManager = async () => {
    try {

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const votSysContract = new ethers.Contract(contractAddress, contractABI, signer);

        setVotingSystemContract(votSysContract);  // set contract data here

        let val = await votSysContract.isManager(currentAccount);
        setIsManager(val);

      }
      else
        console.log("no metamask wallet");


    } catch (error) {
      console.log(error);
    }
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // Check networks.js for hexadecimal network ids
      });

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {

    if (ethereum) {
      ethereum.on("accountsChanged", (account) => {

        setCurrentAccount(account);
      })

    }
    else
      console.log("No metamask!");

    return () => {
      // ethereum.removeListener('accountsChanged');

    }
  }, [])


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount])

  return (
    <div className="App">
      <h2 className='mt-3 mb-3'>Decentralized Voting System</h2>


      <button onClick={connectWallet}>Connect Wallet</button>
      <h4 className='mt-2'>{currentAccount}</h4>
      {
        currentAccount && (chainId !== '0x5') &&
        (<>
          <button className='btn btn-primary' onClick={switchNetwork}> Switch Network</button>
        </>)
      }
      {currentAccount && (chainId === '0x5') ? (

        isManager ? <Admin contract={votingSystemContract} /> : <Voter contract={votingSystemContract} />
      ) : ""
      }

    </div>
  );
}

export default App;
