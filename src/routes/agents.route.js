import { Router } from "express"
import { registerAgent, loginAgent, logoutAgent } from "../controllers/agents.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


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
router.route("/logout").post(verifyJWT, logoutAgent)

export default router