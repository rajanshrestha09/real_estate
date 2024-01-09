import { Router } from "express"
import { registerAgent, loginAgent } from "../controllers/agents.controller.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        }
    ]
    )
    , registerAgent)

router.route("/login").post(loginAgent)

export default router