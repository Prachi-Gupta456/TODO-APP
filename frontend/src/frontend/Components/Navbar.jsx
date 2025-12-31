import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../../Styles/navStyle.css'
import '../../index.css'

function Navbar() {

    const handleLogout = async () => {

        const result = await fetch("http://localhost:5000/logout",{
            method:"POST"
        })
        localStorage.removeItem('login')
        
    }

    return (
        <>
            <div className="nav">
                <NavLink to = "/login" onClick={handleLogout} className="logout">Logout</NavLink>
            </div>
        </>
    )
}

export default Navbar;