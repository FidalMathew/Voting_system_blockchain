import React from 'react'

function Navbar({ user }) {
    return (
        <div className='head_navbar rounded'>
            <h2>
                Decentralized Voting System
            </h2>
            {user && <div className='bg-dark text-white p-1'>{user}</div>
            }
        </div>
    )
}

export default Navbar