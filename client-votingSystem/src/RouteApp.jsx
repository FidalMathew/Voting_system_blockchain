import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Admin from "./Admin";
import App from "./App";
import SendNft from "./SendNft"
import Voter from "./Voter";



function RouteApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<App />} />
                <Route exact path="/admin" element={<Admin />} />
                <Route exact path="/voter" element={<Voter />} />
                <Route path="/nft" element={<SendNft />} />
                {/* Add a 404 page  */}
            </Routes>
        </BrowserRouter>
    )
}

export default RouteApp