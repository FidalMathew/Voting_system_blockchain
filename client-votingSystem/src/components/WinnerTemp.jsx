import { useContext } from "react";
import { VoterContext } from "../Context/Context";


function WinnerTemp() {

    const { winner } = useContext(VoterContext)
    return (
        <div>{
            (winner.votes !== 0) && (
                <div className="bg-white mt-2">
                    <b> Winner:</b> {winner.name}
                    ( {winner.address})
                </div>
            )

        }</div>
    )
}

export default WinnerTemp