import express from "express"
import cors from "cors"
import { ObjectId } from "mongodb"
import { connection, collectionName } from './dbconfig.js'
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import bcrypt from "bcrypt"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

// logout ================
app.post("/logout", async (req, resp) => {

        resp.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        resp.send({ msg: "Logged out", success: true })
  
})
// ====================

// Task list =========================================

app.get("/task-list", verifyJWTToken, async (req, resp) => {

    try {
        const db = await connection()
        const collection = await db.collection(collectionName)

        const result = await collection.find().toArray()

        if (result) {
            resp.send({ message: "task-list fetched", success: true, result })
        }
        else {
            resp.send({ message: "try after some time", success: false })
        }
    }
    catch (error) {
        resp.send(error.message)
    }
})
// ===================================================

// User Authentication ===================================

app.post("/login", async (req, resp) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return resp.send({
                msg: "All fields required",
                success: false
            })
        }

        const db = await connection();
        const collection = db.collection("users")

        const user = await collection.findOne({ email })

        if (!user) {
            return resp.send({ msg: "User not found", success: false })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return resp.send({
                msg: "Wrong Password",
                success: false
            })
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: "5d" })

        resp.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        resp.send({
            success: true,
            message: "Login done!"
        })
    }

    catch (error) {

        resp.send({
            success: false,
            message: "Login failed"
        })
    }

})


app.post("/signUp", async (req, resp) => {

    const userData = req.body
    const { name, email, password } = userData

    if (name && email && password) {
        const db = await connection();
        const collection = db.collection("users")

        const match = await collection.findOne({ email: email })

        if (match) {
            return resp.send({
                exist: true,
                msg: "User already found",
                success: false
            })
        }

        const hashed = await bcrypt.hash(password, 10)

        const newUser = {
            name: name,
            email: email,
            password: hashed
        }

        const result = await collection.insertOne(newUser)

        if (result) {
            jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, { expiresIn: "5d" }, (error, token) => {

                resp.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax"

                });

                resp.send({
                    exist: false,
                    success: true,
                    message: "Sign up done!"
                })
            })

        }
        else {
            resp.send({
                exist: false,
                success: false,
                message: "Sign up failed!"
            })
        }
    }
    else {
        resp.status(400).send({
            success: false,
            msg: "All fields are required"
        })
    }

})

// =======================================================

// =========== add tasks ==================================
app.post("/add-tasks", verifyJWTToken, async (req, resp) => {

    try {

        const db = await connection()
        const collection = db.collection(collectionName)
        const result = await collection.insertOne(req.body)
        if (result) {
            resp.send({
                _id: result.insertedId,
                taskTitle: req.body.taskTitle,
                completed: false
            })
        }
    }

    catch (err) {
        console.log("ERROR 👉", err);
        resp.status(500).send(err.message);
    }

})
// =================================================

// removing tasks=================================
app.delete("/remove-tasks/:id", verifyJWTToken, async (req, resp) => {

    try {

        const db = await connection()
        const collection = db.collection(collectionName)
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) })
        if (result) {
            resp.send({
                msg: "Deleted successfully",
                success: true
            })
        } else {
            resp.send({
                msg: "Deletion failed",
                success: false
            })
        }
    }

    catch (err) {
        console.log("ERROR 👉", err);
        resp.status(500).send(err.message);
    }
})
// ===================================================


// updating tasks=================================
app.put("/update-tasks/:id", verifyJWTToken, async (req, resp) => {

    try {

        const db = await connection()
        const collection = db.collection(collectionName)
        const filter = { _id: new ObjectId(req.params.id) }
        const update = { $set: { taskTitle: req.body.taskTitle } }
        const result = await collection.updateOne(filter, update)

        resp.send("Task Updated successfully!")
    }
    catch (error) {
        resp.status(500).send(error.message)
    }


})
// ===================================================

app.get("/", (req, resp) => {
    resp.send("Working...")
})


// token verifier middleware =====================

function verifyJWTToken(req, resp, next) {

    const token = req.cookies['token']

    if (!token) {
        return resp.status(401).send({
            msg: "Unauthorized",
            success: false
        })
    }
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            console.log(error.message)
            return resp.send({
                msg: "Invalid token",
                success: false
            })
        }
        next()
    })

}
// ===============================================



app.listen(5000)