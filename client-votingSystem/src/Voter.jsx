import React, { useState, useEffect } from 'react'
import { useContext } from "react";
import AllNfts from './components/AllNfts';
import WinnerTemp from './components/WinnerTemp';
import { VoterContext } from "./Context/Context";

function Voter() {

    const { currentAccount, votingSystemContract, setWinner } = useContext(VoterContext)
    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);

    const [auth, setAuth] = useState(false);
    const [header, setHeader] = useState("");


    useEffect(() => {
        const votingSystem = async () => {

            try {

                const Cand = await votingSystemContract.getCandidates();
                setCandidates(Cand)

            } catch (error) {
                console.log(error)
            }

            try {

                const Vot = await votingSystemContract.getVoters();
                setVoters(Vot)

            } catch (error) {
                console.log(error)
            }
        }
        if (votingSystemContract)
            votingSystem();


    }, [votingSystemContract])

    useEffect(() => {

        const checkVoter = () => {

            let flag = 0;
            let pos = -1;
            for (let i = 0; i < voters.length; i++) {
                let val = voters[i].voterAddress.toLowerCase()
                // console.log(currentAccount, " --- ", val)
                if (currentAccount && currentAccount.localeCompare(val) === 0) {
                    // console.log("Yess")
                    flag = 1;
                    pos = i;
                    break;
                }

            }

            if (flag === 0) {
                // console.log("dsas")
                setHeader("Invalid Voter! No Voting Access");
            }

            else if (flag && !voters[pos].voted) {
                // console.log("pass")
                setHeader("")
                setAuth(true);
            }
            else
                setHeader("Voter already Voted! Kindly wait for the results")
        }
        checkVoter();

    }, [currentAccount, voters])


    const getWinner = async () => {
        const winT = await votingSystemContract.candWinner();
        // console.log(winT);
        if (parseInt(winT._votes._hex) === 0) {
            alert("No Winner! Highest Votes: 0")
            return;
        }
        console.log(winT);
        alert(`${winT._name} is the winT by ${parseInt(winT._votes._hex)} votes!`)
        setWinner({ address: winT._candAddress, name: winT._name, proposal: winT._proposal, votes: parseInt(winT._votes._hex) })
    }

    const voteCandidate = async (_candAddress) => {
        // console.log(_candAddress, " ", votingSystemContract);
        try {
            await votingSystemContract.voteCandidate(_candAddress);
            setHeader("Voter already Voted! Kindly wait for the results")

        } catch (error) {
            alert("Invalid Voter")
        }
    }

    return (<div className='container-fluid mt-5  text-center'>

        <h2 className='text-white mb-5'>Candidates</h2>
        <div className='d-flex align-items-center justify-content-around'>
            {
                candidates.map((val) => {
                    // console.log(val);
                    return (
                        <div key={val.candAddress} className="p-5 pt-2 pb-2 bg-white rounded ms-5 me-5">
                            <h3>{val.name} </h3>
                            <div >
                                {val.proposal}
                            </div>
                            <div className='mt-2 mb-4'>
                                {`${val.candAddress.slice(0, 5)}...${val.candAddress.slice(-3)}`}
                            </div>

                            {auth && <button className='bttn_ui' style={{ background: "#82ff9f" }} onClick={() => voteCandidate(val.candAddress)}>
                                Vote
                            </button>}
                        </div>)
                })
            }
        </div>
        <div>
            <button className='bttn_ui mt-5 mb-2' style={{ background: "rgb(96 230 255)" }} onClick={getWinner} >Get Winner</button>
        </div>
        <div style={{ color: "tomato" }}>
            {header}
        </div>
        <WinnerTemp />
        <AllNfts />
    </div>
    )
}

export default Voter