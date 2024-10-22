const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./routes/index")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

const PORT = process.env.PORT

// Establish DBServer
async function initializeDBServer(){
    try {
        app.listen(PORT, () => {
            console.log("Server running at ",PORT)
        })
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB server established")
    }
    catch (error) {
        console.log("MongoDB server error: "+ error )
    }
}

initializeDBServer()


app.use("/api",router)