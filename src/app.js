import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: process.env.ORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}, {limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes
import registerAgent from "./routes/agents.route.js";

app.use("/api/v1/agent", registerAgent)

import addPropertiesRoute from "./routes/properites.route.js"
app.use("/api/v1/properties", addPropertiesRoute)

export {app}