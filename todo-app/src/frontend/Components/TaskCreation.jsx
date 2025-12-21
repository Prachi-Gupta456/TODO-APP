import React, { use, useEffect } from "react"
import addTask from "../../assets/addTask.png"
import doneSound from "../../assets/doneSound.mp3"
import deleteSound from "../../assets/deleteSound.mp3"
import addSound from "../../assets/addSound.mp3"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from './Navbar.jsx'


function TaskCreation() {

    const [taskData, setTaskData] = useState([])
    const inputRef = useRef(null)
    const doneSoundRef = useRef(null)
    const deleteSoundRef = useRef(null)
    const addSoundRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('login')) {
            navigate("/")
        }
    })

    // Accessing previous task list 
    const getListData = async () => {


        try {
            let list = await fetch("http://localhost:5000/task-list", {
                credentials: 'include'
            })
            list = await list.json()
            if (list.success) {
                setTaskData(list.result)
            }
        }
        catch (error) {
            console.log(error.message)
        }

    }
    useEffect(() => {
        getListData()
    }, [])
    // ============================

    // creating audio object====
    useEffect(() => {
        doneSoundRef.current = new Audio(doneSound)
        deleteSoundRef.current = new Audio(deleteSound)
        addSoundRef.current = new Audio(addSound)
    }, [])
    // =========================

    // Adding new tasks to database ======
    const handleAddTask = async (newTask) => {
        try {
            let result = await fetch("http://localhost:5000/add-tasks", {
                method: "Post",
                body: JSON.stringify(newTask),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            result = await result.json()
            console.log(result)

            setTaskData(taskData => [...taskData, result])
        }
        catch (error) {
            console.log("Deletion failed : ", error)
        }

    }
    // ===================================
    const taskHandler = () => {

        const task = inputRef.current.value.trim();

        if (!task) return;

        // add sound effect
        const sound = addSoundRef.current
        sound.currentTime = 0
        sound.play()
        // ====================



        const newTask = {
            taskTitle: task,
            completed: false

        }

        handleAddTask(newTask);

        inputRef.current.value = ""
    }
    // ===================================

    // Removing tasks from database
    const deleteTask = async (id) => {

        const sound = deleteSoundRef.current
        sound.currentTime = 0
        sound.play()

        try {
            let result = await fetch(`http://localhost:5000/remove-tasks/${id}`, {
                method: "Delete",
                credentials: 'include',
                headers: {
                    'Content-Type': 'Application/Json'
                }
            })

            result = await result.json()

            if(result.success){
                setTaskData(taskData => taskData.filter((task) => task._id != id))
            }
            else{
                console.log(result)
            }
            
            // update taskData in ui
            inputRef.current.value = ""

        }
        catch (error) {
            console.log("Deletion failed : ", error)
        }
    }
    // ====================================

    // Handling completed tasks ====================
    const handleDone = (id) => {

        const sound = doneSoundRef.current
        sound.currentTime = 0;
        sound.play()

        setTaskData(taskData.map((task) => (
            task._id === id ? { ...task, completed: true } : task
        )))

    }
    // ===============================================

    // Updating tasks ====================
    const updateTask = async (task) => {

        inputRef.current.focus()
        const newTitle = inputRef.current.value

        inputRef.current.value = ""

        if (!newTitle) return ;

        try {
            let result = await fetch(`http://localhost:5000/update-tasks/${task._id}`, {
                method: "PUT",
                body: JSON.stringify({ taskTitle: newTitle }),
                credentials: 'include',
                headers: {
                    'Content-type': "Application/Json"
                }
            })

            setTaskData(taskData =>
                taskData.map(t => t._id === task._id ? { ...t, taskTitle: newTitle } : t))
        }
        catch (error) {
            console.log("Updation failed : ", error)
        }
    }
    // ===============================================


    return (
        <>
           <Navbar/>
            <div className="task-page">

                <div className="box-one">

                    <input ref={inputRef} type="text" placeholder="What do you want to do today ? Add your tasks here." />
                    <img onClick={taskHandler} src={addTask} />

                </div>

                {
                    taskData.map((task) => (
                        <div key={task._id} className={task.completed ? "tasks-list-done" : "tasks-list"}>{task.taskTitle}
                            <div className="btns">
                                <button id="done-btn" disabled = {task.completed} onClick={() => handleDone(task._id)}>Done</button>
                                <button id="update-btn" disabled = {task.completed} onClick={() => updateTask(task)}>Update</button>
                                <button id="remove-btn" onClick={() => deleteTask(task._id)}>Delete</button>
                            </div>
                        </div>

                    ))
                }

            </div>




        </>
    )
}


export default TaskCreation;

