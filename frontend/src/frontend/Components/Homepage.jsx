import React, { use } from "react"
import '../../Styles/style.css'
import '../../Styles/formStyle.css'
import task from '../../assets/task.png'
import alarmClock from '../../assets/alarm.png'
import { NavLink} from "react-router-dom"
import { useEffect } from "react"

function HomePage() {
    
  useEffect(() => {
            if(localStorage.getItem('login')){
              localStorage.removeItem('login')
            }
  },[])
  return (
    <>

      {/* Welcome box -------------------------------*/}
      <div className="welcome">
        Welcome  to  <span style={{ "color": "rgba(16, 150, 160, 1)" }}> To-do  List </span>
      </div>
      {/* ------------------------------------------- */}

      {/* container holding contents---------------------- */}
      <div className="container">

        {/* box one ---------------------------------- */}
        <div className="content-box-one">

          <img src={task} />
          <div>
            <span> Fast Task Creation </span>
            <div>Add tasks, subtasks, and recurring items in seconds.</div>
          </div>
        </div>
        {/* ----------------------------------- */}

        {/* box two --------------------------------- */}
        <div className="content-box-two">

          <img src={alarmClock} />
          <div>
            <span> Smart Reminders </span>
            <div>Get notified at the perfect time so you never forget anything.</div>
          </div>
        </div>
        {/* ---------------------------------------------------- */}

        {/* button to go to next page ------*/}
         
        <div className="login-signup-btns">
          <NavLink to="/signUp" className="links">SignUp</NavLink>
          <span>  /  </span>
          <NavLink to="/login" className="links">Login</NavLink>
        </div>

        {/* ---------------------------- */}
      </div>

      {/* -------------------------------------------------------- */}



    </>
  )
}

export default HomePage
