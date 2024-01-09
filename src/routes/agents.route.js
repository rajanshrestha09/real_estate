import {Router} from "express"

import { registerAgent } from "../controllers/agents.controller.js"


const router = Router();

router.route("/register").post(registerAgent)


export default router