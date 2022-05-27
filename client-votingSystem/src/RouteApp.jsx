import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Admin from "./Admin";
import App from "./App";
import SendNft from "./SendNft"
import Voter from "./Voter";
import { useContext } from "react";
import { VoterContext } from "./Context/Context";
import Home from "./Home";
import './App.css';
import Navbar from './components/Navbar';
import Error from "./Error";

function RouteApp() {

    const { currentAccount, isManager, errorPage } = useContext(VoterContext)

    return (
        <div className="App">
            <Navbar user={currentAccount} />
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/system" element={(errorPage) ? <Home /> : <App />} />
                    <Route path="/nft" element={(!errorPage && isManager) ? <SendNft /> : <Home />} />
                    <Route path="*" element={<Error />} />

                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default RouteApp