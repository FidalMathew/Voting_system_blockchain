import React, { useState, useEffect } from 'react'

function Admin({ contract }) {

    const [V_walletAdd, setV_walletAdd] = useState("")
    const [V_name, setV_name] = useState("")
    const [C_walletAdd, setC_walletAdd] = useState("")
    const [C_name, setC_name] = useState("")
    const [C_proposal, setC_proposal] = useState("")


    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);


    const [viewSystem, setViewSystem] = useState(false)

    const changeSystem = () => {
        setViewSystem(!viewSystem);
    }


    const addVoter = async () => {
        await contract.addVoter(V_walletAdd, V_name);
        setV_name("");
        setV_walletAdd("");
    }


    const addCandidate = async () => {
        console.log(contract)
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
    }, [contract])

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
                {
                    !viewSystem && (
                        <div>
                            <div className='row'>
                                <div className='col-6 text-center text-white'>
                                    <h4 className='mb-4'>
                                        Voters
                                    </h4>
                                    <div className='d-flex flex-column align-items-center justify-content-center'>

                                        <input type="text" placeholder='wallet address' value={V_walletAdd} onChange={(e) => setV_walletAdd(e.target.value)} autoComplete="new-off" />
                                        <input type="text" placeholder='name' value={V_name} onChange={(e) => setV_name(e.target.value)} autoComplete="new-off" />
                                        <button className='bttn_ui' onClick={addVoter} >Add voter</button>
                                    </div>

                                </div>
                                <div className='col text-center text-white'>
                                    <h4 className='mb-4'>
                                        Candidates
                                    </h4>
                                    <div className='d-flex flex-column align-items-center justify-content-center'>

                                        <input type="text" placeholder='wallet address' value={C_walletAdd} onChange={(e) => setC_walletAdd(e.target.value)} autoComplete="new-off" />
                                        <input type="text" placeholder='name' value={C_name} onChange={(e) => setC_name(e.target.value)} autoComplete="new-off" />
                                        <input type="text" placeholder='proposal' value={C_proposal} onChange={(e) => setC_proposal(e.target.value)} autoComplete="new-off" />
                                        <button className='bttn_ui' onClick={addCandidate} > Add candidate</button>
                                    </div>
                                </div>

                            </div>
                            <div className='text-center'>
                                <button onClick={changeSystem} className='bttn_ui mt-5' style={{ backgroundImage: "linear-gradient(#a1ffd6, #50ffc0)" }}>
                                    View Voting System
                                </button>
                            </div>

                        </div>)
                }
                {
                    viewSystem && (
                        <div>
                            <div className='row text-center text-white'>
                                <div className='col-6 '>
                                    <h4>
                                        Voters
                                    </h4>
                                    <br />
                                    <div className='d-flex flex-column align-items-center justify-content-center'>
                                        {
                                            voters.map((val) => {
                                                return (
                                                    <div className='row systemUser' key={val.voterAddress}>
                                                        <div className=" col-11" >
                                                            <b> {val.name} </b><br /> {val.voterAddress}
                                                        </div>
                                                        <div className='col-1' style={{ background: `${val.voted ? "#60ff60" : "#ff6060"} ` }}></div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='col'>
                                    <h4>
                                        Candidates
                                    </h4>
                                    <br />
                                    <div className='d-flex flex-column align-items-center justify-content-center'>

                                        {
                                            candidates.map((val) => {
                                                // console.log(val);
                                                return (
                                                    <div className='row systemUser' key={val.candAddress}>

                                                        <div className=" col-11 text-align-left">
                                                            <b>{val.name} </b>  <br />
                                                            <b> {val.proposal}</b>  <br />
                                                            {val.candAddress}
                                                        </div>
                                                        <div className='col-1 pt-4' style={{ background: "#ffb52d" }}> {parseInt(val.votes._hex)}</div>

                                                    </div>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className='btn btn-primary m-3 mt-5' onClick={startVoting}> Start Voting </button>
                                <button className='btn btn-danger m-3 mt-5' onClick={endVoting}> End Voting </button>

                                <div>
                                    <button onClick={getWinner} >Get Winner</button>
                                </div>
                            </div>
                            <div className='text-center'>
                                <button onClick={changeSystem}>
                                    View Voting System
                                </button>
                            </div>

                        </div>)}
            </div>
        </>)
}

export default Admin