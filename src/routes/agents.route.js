import { Router } from "express"
import { registerAgent } from "../controllers/agents.controller.js"
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



export default router