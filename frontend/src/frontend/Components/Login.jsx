import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "../../Styles/formStyle.css"


function Login() {

    const [userData, setUserData] = useState({})
    const [isFilled,setIsFilled] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('login')){
            navigate("/taskCreation")
        }
    })

    // handling login =================================================
    const handleLogin = async () => {
        
      if(!userData.email || !userData.password){
            setIsFilled(false)
            return;
        }
        try {
            let result = await fetch("http://localhost:5000/login", {
                method: "POST",
                body: JSON.stringify(userData),
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
           result = await result.json()
           
           if(result.success){

            // store email in local storage
               localStorage.setItem('login',userData.email)
            //    ============================

               navigate("/taskCreation")

           }

        }
        catch (error) {
            response.status(500).send("Error occured : ", error.message)
        }
    }
    // ====================================================================


    return (
        <div className="box-container">
            <div className="form-container">
                <h1>Login</h1>

                {!isFilled ? <div className="warning">Please enter valid email or password!</div> : null }

                <div className="box">
                    <label htmlFor="">Email</label>
                    <input type="text" onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder="Enter user email" name="email" required></input>
                </div>

                <div className="box">
                    <label htmlFor="">Password</label>
                    <input type="password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} placeholder="Enter user password" name="password" required></input>
                </div>

                <button className="submit" onClick={handleLogin}>Login</button>
                <NavLink to="/signUp" className="links" style = {{"place-self":"center"}}>SignUp</NavLink>

            </div>
        </div>
    )
}

export default Login;