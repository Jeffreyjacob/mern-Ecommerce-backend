import express from "express"
import { JwtParse, jwtCheck } from "../middleware/JwtCheck"
import Controller from '../controller/adminProductController';
import multer from "multer";
import { ValidateCreateProduct } from "../middleware/Validation";

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

router.route("/").post(
    upload.single("imageFile"),
    ValidateCreateProduct,
    jwtCheck,
    JwtParse,
    Controller.createProduct
)
router.route("/").get(jwtCheck,JwtParse,Controller.getProductbyUser)
router.route("/delete").delete(jwtCheck,JwtParse,Controller.deleteProductbyUser)



export default router