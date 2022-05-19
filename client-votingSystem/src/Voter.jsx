import React, { useState, useEffect } from 'react'


function Voter({ contract }) {

    const [candidates, setCandidates] = useState([]);


    useEffect(() => {
        const votingSystem = async () => {

            const Cand = await contract.getCandidates();

            setCandidates(Cand)

        }
        console.log("dsa");

        votingSystem();
    }, [contract])


    const voteCandidate = async (_candAddress) => {
        console.log(_candAddress, " ", contract);
        await contract.voteCandidate(_candAddress);
    }

    return (<div>
        <div>Voter</div>
        <div>
            {
                candidates.map((val) => {
                    // console.log(val);
                    return (
                        <div key={val.candAddress} className="py-3">

                            {val.candAddress}  {val.name}  {val.proposal} {parseInt(val.votes._hex)}
                            <button className='btn btn-primary ms-3' onClick={() => voteCandidate(val.candAddress)}>
                                Vote</button>
                        </div>)
                })
            }
        </div>
    </div>
    )
}

export default Voter