import React, { useState, useEffect } from 'react'

function Admin({ contract }) {


    const [V_walletAdd, setV_walletAdd] = useState("")
    const [V_name, setV_name] = useState("")
    const [C_walletAdd, setC_walletAdd] = useState("")
    const [C_name, setC_name] = useState("")
    const [C_proposal, setC_proposal] = useState("")


    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);

    const votingSystem = async () => {

        const Cand = await contract.getCandidates();
        console.log(Cand);
        setCandidates(Cand)

        const Vot = await contract.getVoters();
    }


    const addVoter = async () => {
        await contract.addVoter(V_walletAdd, V_name);
        setV_name("");
        setV_walletAdd("");
    }


    const addCandidate = async () => {
        await contract.addCandidate(C_walletAdd, C_name, C_proposal);
        setC_walletAdd("");
        setC_name("");
        setC_proposal("");
    }

    useEffect(() => {
        votingSystem();
    }, [])


    return (
        <>
            <div className='container-fluid mt-5'>
                <div className='row'>

                    <div className='col-5'>
                        <h4>
                            Voters
                        </h4>
                        <input type="text" placeholder='wallet address' value={V_walletAdd} onChange={(e) => setV_walletAdd(e.target.value)} />
                        <input type="text" placeholder='name' value={V_name} onChange={(e) => setV_name(e.target.value)} />
                        <button onClick={addVoter} >Add voter</button>
                        <br />
                        {
                            voters.map((val) => {
                                console.log(val);
                                return <></>
                            })
                        }
                    </div>
                    <div className='col'>
                        <h4>
                            Candidates
                        </h4>
                        <input type="text" placeholder='wallet address' value={C_walletAdd} onChange={(e) => setC_walletAdd(e.target.value)} />
                        <input type="text" placeholder='name' value={C_name} onChange={(e) => setC_name(e.target.value)} />
                        <input type="text" placeholder='proposal' value={C_proposal} onChange={(e) => setC_proposal(e.target.value)} />

                        <button onClick={addCandidate} > Add candidate</button>
                        <br />
                        {
                            candidates.map((val) => {
                                // console.log(val);
                                return (
                                    <div key={val.candAddress}>

                                        {val.candAddress}  {val.name}  {val.proposal} {parseInt(val.votes._hex)}
                                    </div>)
                            })
                        }

                    </div>
                </div>

            </div>
        </>
    )
}

export default Admin