import './App.css';
import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import abi from "./utils/VotingSystem.json";

import Admin from './Admin';
import Voter from './Voter';
import Navbar from './components/Navbar';
import ethImg from './utils/eth.gif'

function App() {
  const [chainId, setChainId] = useState("")

  const [currentAccount, setCurrentAccount] = useState("")
  const [votingSystemContract, setVotingSystemContract] = useState("");

  const [isManager, setIsManager] = useState(false);

  const contractAddress = "0x81466b87db90B679897BA62786c9367E06efCC87"
  const contractABI = abi.abi;
  const { ethereum } = window;




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
  }, [ethereum])


  useEffect(() => {

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



    checkIfWalletIsConnected();
  }, [currentAccount, contractABI, ethereum])

  return (
    <div className="App">
      <Navbar user={currentAccount} />

      {currentAccount && (chainId === '0x5') ? (

        isManager ? <Admin contract={votingSystemContract} /> : <Voter contract={votingSystemContract} />
      ) : (
        <>
          <div className='home_content'>
            <div className='pe-5'>
              <div className='text-white ' style={{ fontSize: "22px" }}>
                The <b>Decentralized Voting System</b> (DVS) provides <br />
                a platform for voting. Features include: <br />
                <ul>
                  <li>
                    Admin access to contract deployer
                  </li>
                  <li>Candidate voting by fixed no. of voters</li>
                  <li>Candidates and voters added by the admin</li>
                  <li>Admin starts and ends voting</li>
                </ul>

              </div>
              {
                !currentAccount &&
                (<div className='mt-3'>
                  <button className='bttn_ui' onClick={connectWallet}>Connect Wallet</button>
                </div>
                )
              }

              {
                currentAccount && (chainId !== '0x5') &&
                (<div className='mt-1'>
                  <button className='bttn_ui' onClick={switchNetwork}> Switch Network</button>
                  <div style={{ color: "#ffa6b8" }}>The network connected is incompactable, kindly switch to Goerli network :)</div>

                </div>)
              }
            </div>
            <div className='ps-5 d-none d-md-block'>
              <img src={ethImg} alt="" />
            </div>
          </div>
        </>
      )
      }

    </div>
  );
}

export default App;
