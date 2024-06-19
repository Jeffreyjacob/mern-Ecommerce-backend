import express from 'express'
import Controller from '../controller/wishlistController';
import { JwtParse, jwtCheck } from '../middleware/JwtCheck';
import { ValidateCreateWishlist } from '../middleware/Validation';

const router = express.Router()

router.route("/createWishlist",).post(jwtCheck,JwtParse,ValidateCreateWishlist,Controller.createWishlist)
router.route("/").get(jwtCheck,JwtParse,Controller.getWishList)
export default router