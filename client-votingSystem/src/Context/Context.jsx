import { useEffect, useState, createContext } from 'react'
import { ethers } from "ethers";
import abi from "../utils/VotingSystem.json";

export const VoterContext = createContext()


export const VoterProvider = ({ children }) => {

    const [chainId, setChainId] = useState("")

    const [currentAccount, setCurrentAccount] = useState("")
    const [votingSystemContract, setVotingSystemContract] = useState("");

    const [isManager, setIsManager] = useState(false);
    const [errorPage, setErrorPage] = useState(false)

    const contractAddress = "0xAF9aA2b8551e2523AA6670cd8743Aeff2F291c94"
    const contractABI = abi.abi;
    const { ethereum } = window;


    useEffect(() => {

        const getContract = () => {

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const votSysContract = new ethers.Contract(contractAddress, contractABI, signer);

            setVotingSystemContract(votSysContract);
        }
        if (ethereum)
            getContract();
    }, [ethereum, contractABI])

    useEffect(() => {

        const checkIfManager = async () => {
            try {

                if (window.ethereum && votingSystemContract && currentAccount && chainId === '0x13881') {

                    let val = await votingSystemContract.isManager(currentAccount);
                    setIsManager(val);
                }
                else
                    console.log("no metamask wallet");


            } catch (error) {
                console.log(error);
            }
        }

        if (currentAccount)
            checkIfManager();


    }, [votingSystemContract, currentAccount, chainId])





    useEffect(() => {

        if (ethereum) {
            ethereum.on("accountsChanged", (accounts) => {

                setCurrentAccount(accounts[0]);
            })

        }
        else
            console.log("No metamask!");

        return () => {
            // ethereum.removeListener('accountsChanged');

        }
    }, [ethereum])






    useEffect(() => {
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
                params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (chainId !== "0x13881" || !currentAccount)
            setErrorPage(true)
        else
            setErrorPage(false)

    }, [chainId, currentAccount])



    return (
        <VoterContext.Provider
            value={{
                chainId, currentAccount, votingSystemContract, isManager, errorPage, switchNetwork, connectWallet
            }}
        >
            {children}
        </VoterContext.Provider>
    )
}


