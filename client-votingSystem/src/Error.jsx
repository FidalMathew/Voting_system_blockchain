import { Link } from 'react-router-dom'

function Error() {
    return (<>
        <h2 className='text-white mt-3'>ERROR PAGE</h2>
        <p className='text-white'> 404 Page does'nt exist</p>
        <Link to="/"> <button className='bttn_ui'> Redirect to Home page </button></Link>
    </>
    )
}

export default Error