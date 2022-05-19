import React, { useState, useEffect } from 'react'

function Admin({ contract }) {


    const [V_walletAdd, setV_walletAdd] = useState("")
    const [V_name, setV_name] = useState("")
    const [C_walletAdd, setC_walletAdd] = useState("")
    const [C_name, setC_name] = useState("")
    const [C_proposal, setC_proposal] = useState("")


    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);




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
        const votingSystem = async () => {

            const Cand = await contract.getCandidates();
            console.log(Cand)
            setCandidates(Cand)

            const Vot = await contract.getVoters();
            setVoters(Vot)
        }

        votingSystem();
    }, [])

    useEffect(() => {

        const onNewCandidate = (candAddress, name, proposal, votes) => {
            console.log("NewCandidate", candAddress, name, proposal, votes);
            setCandidates(prevState => [
                ...prevState,
                {
                    candAddress, name, proposal, votes
                },
            ]);
        };

        const onNewVoter = (voterAddress, name, voted) => {
            console.log("NewVoter", voterAddress, name, voted);
            setVoters(prevState => [
                ...prevState,
                {
                    voterAddress, name, voted
                },
            ]);
        };

        if (window.ethereum) {
            contract.on("NewCandidate", onNewCandidate);
            contract.on("NewVoter", onNewVoter);

        }

        return () => {
            if (contract) {
                contract.off("NewCandidate", onNewCandidate);
                contract.off("NewVoter", onNewVoter);
            }
        };
    }, [contract]);


    const startVoting = async () => {
        await contract.startVoting();
    }
    const endVoting = async () => {

        await contract.endVoting();
        getWinner();
    }

    const getWinner = async () => {
        const winner = await contract.candWinner();
        console.log(winner);
        alert(`${winner._name} is the winner by ${parseInt(winner._votes._hex)} votes!`)
    }


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
                                return (
                                    <div key={val.voterAddress}>
                                        {val.voterAddress}  {val.name}  {`${val.voted}`}
                                    </div>)
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
                <div>
                    <button className='btn btn-primary m-3 mt-5' onClick={startVoting}> Start Voting </button>
                    <button className='btn btn-danger m-3 mt-5' onClick={endVoting}> End Voting </button>

                    <div>
                        <button onClick={getWinner} >Get Winner</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin