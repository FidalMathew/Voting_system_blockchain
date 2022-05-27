import axios from 'axios';
import React, { useState } from 'react'
import { Link } from "react-router-dom";


function SendNft() {

    const [fileImg, setFileImg] = useState(null);
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [jsonIPFS, setJsonIPFS] = useState("")

    const sendFileToIPFS = async (e) => {

        e.preventDefault();

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
                    setJsonIPFS(`ipfs://${resJSON.data.IpfsHash}`);

                } catch (error) {
                    console.log("JSON to IPFS: ")
                    console.log(error);
                }


            } catch (error) {
                console.log("File to IPFS: ")
                console.log(error)
            }
        }
    }

    return (
        <div className='mt-5 text-center'>
            <h2 className='text-white mb-5'>Send NFT</h2>
            <form onSubmit={sendFileToIPFS}>
                <label htmlFor="files" className="btn" style={{ color: "white", marginLeft: "100px" }}>Select Image</label>
                <input id="files" type="file" onChange={(e) => setFileImg(e.target.files[0])} required placeholder='image' />
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder='name' required />
                <input type="text" onChange={(e) => setDesc(e.target.value)} placeholder="desc" />
                <br />
                <button className='bttn_ui me-3' type='submit' >Mint NFT</button>
                <Link to="/system" style={{ textDecoration: "none" }}> <button className='bttn_ui mt-3' style={{ background: "#60e6ff", }}> Go to Admin Panal</button></Link>

            </form>
            <div className='text-white mt-2'> The NFT will be sent to the winner </div>

            <div>{jsonIPFS}</div>
        </div>
    )
}

export default SendNft