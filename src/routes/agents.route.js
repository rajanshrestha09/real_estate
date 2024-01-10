import { Router } from "express"
import {
    registerAgent,
    loginAgent,
    logoutAgent,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentAgent,
    updateAgentDetails,
    updateAgentProfilePhoto,
} from "../controllers/agents.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"



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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-agent").get(verifyJWT, getCurrentAgent)
router.route("/update-agent").patch(verifyJWT, updateAgentDetails)
router.route("/update-profile").patch(verifyJWT, upload.single("profileImage") ,updateAgentProfilePhoto)

export default router