import React from "react"
import "./App.css"
import HomePage from "./frontend/Components/Homepage.jsx"
import TaskCreation from "./frontend/Components/TaskCreation.jsx"
import SignUp from "./frontend/Components/SignUp.jsx"
import Login from "./frontend/Components/Login.jsx"
import Protected from "./frontend/Components/Protected.jsx"
import { Routes, Route } from "react-router-dom"

function App() {


  return (
    <>
      <Routes>
        <Route path="/taskCreation" element={<Protected> <TaskCreation/> </Protected>} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
