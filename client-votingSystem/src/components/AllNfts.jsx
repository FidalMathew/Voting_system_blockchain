import { useContext, useEffect, useState } from "react";
import { VoterContext } from "../Context/Context";


function AllNfts() {

    const { tokenID, contractAddress } = useContext(VoterContext)

    const [nftArr, setNftArr] = useState([])


    useEffect(() => {
        setNftArr(Array(tokenID + 1).fill(0));
        // setNftArr(Array(3).fill(0));
        // console.log(tokenID);

    }, [tokenID])


    return (
        <div>
            {
                (tokenID !== -1) && (
                    <div>
                        <div>
                            <div className="text-white">--------------------------------------</div>
                            <h2 className="text-white mb-3 mt-3">Previously minted NFTs</h2>
                        </div>
                        <div className="d-flex align-items-center justify-content-center ">

                            {
                                nftArr.map((val, index) => {
                                    return (
                                        <div className="bg-white text-dark ms-2 me-2 p-2 rounded" key={index} style={{ backgroundImage: "linear-gradient(rgb(255 171 120), rgb(245 243 131))" }} >
                                            <div> <h2>#{index}</h2></div>
                                            <a href={`https://testnets.opensea.io/assets/mumbai/${contractAddress}/${index}`} target="_blank" rel="noopener noreferrer" className="text-dark" > View NFT</a>
                                        </div>)
                                })
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AllNfts