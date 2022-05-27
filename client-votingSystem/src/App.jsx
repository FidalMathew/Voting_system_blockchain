import React from 'react'
import Admin from './Admin'
import Voter from './Voter'
import { useContext } from "react";
import { VoterContext } from "./Context/Context";
import Home from './Home';
function App() {

    const { isManager, errorPage } = useContext(VoterContext)

    return (
        <>
            {
                !errorPage ? (isManager ? <Admin /> : <Voter />) : <Home />

            }    </>
    )

}

export default App