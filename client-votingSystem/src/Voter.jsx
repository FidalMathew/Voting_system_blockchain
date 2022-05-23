import React, { useState, useEffect } from 'react'


function Voter({ contract, user }) {

    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);

    const [auth, setAuth] = useState(false);
    const [header, setHeader] = useState("");


    useEffect(() => {
        const votingSystem = async () => {

            try {

                const Cand = await contract.getCandidates();
                setCandidates(Cand)

            } catch (error) {
                console.log(error)
            }

            try {

                const Vot = await contract.getVoters();
                setVoters(Vot)

            } catch (error) {
                console.log(error)
            }
        }
        votingSystem();
    }, [contract])

    useEffect(() => {

        const checkVoter = () => {

            let flag = 0;
            for (let i = 0; i < voters.length; i++)

                if (user === voters[i].voterAddress) {
                    flag = 1;
                    break;
                }
            if (flag === 0)
                setHeader("Invalid Voter! No Voting Access");

            else if (flag && !user.voted) {
                setAuth(true);
            }
            else
                setHeader("Voter already Voted! Kindly wait for the results")
        }
        checkVoter();

    }, [user, voters])


    const getWinner = async () => {
        const winner = await contract.candWinner();
        // console.log(winner);
        alert(`${winner._name} is the winner by ${parseInt(winner._votes._hex)} votes!`)
    }

    const voteCandidate = async (_candAddress) => {
        // console.log(_candAddress, " ", contract);
        try {
            await contract.voteCandidate(_candAddress);
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
    </div>
    )
}

export default Voter