import axios from 'axios';
import React, { useState, useEffect } from 'react'

// const pinata_api_key = process.env.REACT_APP_PINATA_API_KEY
// const pinata_secret_api_key = process.env.REACT_APP_PINATA_API_SECRET

function SendNft() {

    const [fileImg, setFileImg] = useState(null);
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [jsonIPFS, setJsonIPFS] = useState("")
    useEffect(() => {

        const print = () => {
            console.log(fileImg);
        }

        print()
    }, [fileImg])

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
        <div className='App text-center'>
            <h2 className='text-white mb-5'>Send NFT</h2>
            <form onSubmit={sendFileToIPFS}>
                <label for="files" class="btn" style={{ color: "white", marginLeft: "100px" }}>Select Image</label>
                <input id="files" type="file" onChange={(e) => setFileImg(e.target.files[0])} required placeholder='image' />
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder='name' required />
                <input type="text" onChange={(e) => setDesc(e.target.value)} placeholder="desc" />
                <br />
                <button className='bttn_ui' type='submit' >Mint NFT</button>
            </form>
            <div className='text-white mt-2'> The NFT will be sent to the winner </div>
            <div>{jsonIPFS}</div>
        </div>
    )
}

export default SendNft