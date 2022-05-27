import { useContext, useEffect } from "react";
import { VoterContext } from "./Context/Context";
import ethImg from './utils/eth.gif'
import './App.css';
import { useNavigate } from "react-router-dom"

function Home() {

    const { currentAccount, connectWallet, chainId, switchNetwork } = useContext(VoterContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (currentAccount && chainId === '0x5') {
            navigate("/system")
        }

    }, [currentAccount, navigate, chainId])


    return (
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
                        !currentAccount && (<div className='mt-3'>
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

export default Home