import { Router } from "express"
import {
    addProperties,
    updatePropertiesDetails
} from "../controllers/properties.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.use(verifyJWT)

router.route("/add-properties")
    .post(
        upload.array("propertyImages", 12)
        , addProperties
    )
router.route("/:propertyId").patch(updatePropertiesDetails)




export default router