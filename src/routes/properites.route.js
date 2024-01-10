import {Router} from "express"
import {
    addProperties
} from "../controllers/properties.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();



router.route("/add-properties").post(verifyJWT, 
    upload.array("propertyImages", 12)
    , addProperties)
// router.route("/add-properties").post(verifyJWT, addProperties)




export default router