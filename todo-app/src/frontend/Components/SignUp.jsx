import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "../../Styles/formStyle.css"

function SignUp() {

    const [userData, setUserData] = useState({})
    const [isDisabled,setIsDisabled] = useState(false)
    const [isFilled,setIsFilled] = useState(true)
    const navigate = useNavigate()
   
    useEffect(() => {
        if(localStorage.getItem('login')){
            navigate("/taskCreation")
        }
    })
    
    // handling sign up =================================================
    const handleSignUp = async () => {
        
        if(!userData.email || !userData.name || !userData.password){
            setIsFilled(false)
            return;
        }
        setIsDisabled(true)
        try{
        let result = await fetch("http://localhost:5000/signUp", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(userData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        result = await result.json()

        if(result.exist){
            return alert("User already exist!")
        }
        
        if(!result.exist){
            alert("Sign up done!")
            localStorage.setItem('login',userData.email)
            navigate("/taskCreation")
        }
    }
    catch(error){
        console.log(error.message)
    }
    finally{
          setIsDisabled(false)
    }

    }
    // ====================================================================

    return (
        <div className="box-container">
            <div className="form-container">
                <h1>Sign Up</h1>

                <div className="box">
                     {!isFilled ? <div className="warning">Field value can't be empty!</div> : null }
                    <label htmlFor="">Name</label>
                    <input type="text" onChange={(e) => setUserData({ ...userData, name: e.target.value })} placeholder="Enter user name" name="name"></input>
                </div>

                <div className="box">
                   <label htmlFor="">Email</label>
                    <input type="text" onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder="Enter user email" name="email"></input>
                </div>

                <div className="box">
                    <label htmlFor="">Password</label>
                    <input type="password" onChange={(e) => setUserData({ ...userData, password: e.target.value })} placeholder="Enter user password" name="password"></input>
                </div>

                <div className="btn">
                    <button  className="submit" onClick={handleSignUp}>{isDisabled ? "Signing Up..." : "Sign Up"}</button>
                    <NavLink to="/login" className="links">Login</NavLink>
                </div>

            </div>
        </div>
    )
}

export default SignUp;