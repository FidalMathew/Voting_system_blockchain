import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useContext } from "react";
import { VoterContext } from "./Context/Context";
import AllNfts from './components/AllNfts';
import WinnerTemp from './components/WinnerTemp';

function SendNft() {

    const [fileImg, setFileImg] = useState(null);
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")

    const { votingSystemContract, currentAccount, setTokenID, winner } = useContext(VoterContext)


    const sendJSONtoIPFS = async (ImgHash) => {

        try {

            const resJSON = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                data: {
                    "name": name,
                    "description": desc,
                    "image": ImgHash
                },
                headers: {
                    'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
                },
            });

            console.log("final ", `ipfs://${resJSON.data.IpfsHash}`)
            const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
            console.log("Token URI", tokenURI);
            mintNFT(tokenURI, currentAccount)   // pass the winner

        } catch (error) {
            console.log("JSON to IPFS: ")
            console.log(error);
        }


    }

    const sendFileToIPFS = async (e) => {

        e.preventDefault();
        if (winner.votes === 0) {
            alert("Winner candidate does not exist, max votes=0");
            return;
        }

        if (!winner.address) {
            alert("Winner candidate does not exist, Kindly 'Get Winner' at Admin panel");
            return;
        }

        if (fileImg) {
            try {

                const formData = new FormData();
                formData.append("file", fileImg);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
                        'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                // console.log(response.data.IpfsHash);
                sendJSONtoIPFS(ImgHash)


            } catch (error) {
                console.log("File to IPFS: ")
                console.log(error)
            }
        }
    }


    const mintNFT = async (tokenURI) => {


        try {
            await votingSystemContract.makeAnEpicNFT(tokenURI, winner.address)

            let val = await votingSystemContract.getTokenId();
            console.log(val)
            setTokenID(parseInt(val._hex));

            setFileImg("");
            setName("");
            setDesc("");

        } catch (error) {
            console.log("Error while minting NFT with contract")
            console.log(error);
        }

    }

    useEffect(() => {
        console.log(fileImg)
    }, [fileImg])


    return (
        <div className='mt-3 text-center'>
            <h2 className='text-white mb-3'>Send NFT</h2>
            <form onSubmit={sendFileToIPFS}>
                <input type="file" onChange={(e) => setFileImg(e.target.files[0])} required />
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder='name' required value={name} />
                <input type="text" onChange={(e) => setDesc(e.target.value)} placeholder="desc" required value={desc} />
                <br />
                <button className='bttn_ui me-3' type='submit' >Mint NFT</button>
                <Link to="/system" style={{ textDecoration: "none" }}> <button className='bttn_ui mt-3' style={{ background: "#60e6ff", }}> Go to Admin Panal</button></Link>

            </form>
            <div className='text-white mt-2'> The NFT will be sent to the winner </div>
            <WinnerTemp />
            <AllNfts />

        </div>
    )
}

export default SendNft