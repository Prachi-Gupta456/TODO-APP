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
    const [updateId, setUpdateId] = useState(null);

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

        const data = {
            email: localStorage.getItem('login')
        }

        try {
            let list = await fetch("http://localhost:5000/task-list", {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
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

    // creating audio object====
    useEffect(() => {
        doneSoundRef.current = new Audio(doneSound)
        deleteSoundRef.current = new Audio(deleteSound)
        addSoundRef.current = new Audio(addSound)

        getListData()
    }, [])
    // ============================

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
            user_email: localStorage.getItem('login'),
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

            if (result.success) {
                setTaskData(taskData => taskData.filter((task) => task._id != id))
            }
            else {
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
    const handleDone = async (id) => {

        const sound = doneSoundRef.current
        sound.currentTime = 0;
        sound.play()

        await fetch(`http://localhost:5000/markDone/${id}`);

        setTaskData(taskData.map((task) => (
            task._id === id ? { ...task, completed: true } : task
        )))

    }
    // ===============================================

    // Updating tasks ====================
    const updateTask = async (task) => {

        if (updateId === task._id) {

            const newTitle = inputRef.current.value.trim()
            inputRef.current.value = ""

            if (!newTitle) {
                setUpdateId(null);
                return;
            }
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
            finally {
                setUpdateId(null)
            }
            return;
        }
        setUpdateId(task._id)
        inputRef.current.value = task.taskTitle
        inputRef.current.focus()

    }

    // ===============================================


    return (
        <>
            <Navbar />
            <div className="task-page">

                <div className="box-one">

                    <input ref={inputRef} type="text" placeholder="What do you want to do today ? Add your tasks here." />
                    <img onClick={taskHandler} src={addTask} />

                </div>

                {
                    taskData.map((task) => (
                        <div key={task._id} className={task.completed ? "tasks-list-done" : "tasks-list"}>{task.taskTitle}
                            <div className="btns">
                                <button id="done-btn" disabled={task.completed} onClick={() => handleDone(task._id)}>Done</button>
                                <button id="update-btn"  style={updateId === task._id ? { backgroundColor: "yellow" } : {}} disabled={task.completed} onClick={() => updateTask(task)}>{updateId === task._id ? "Edit":"Update"}</button>
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

