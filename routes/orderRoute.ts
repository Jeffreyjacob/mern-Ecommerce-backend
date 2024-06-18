import express from 'express';
import { JwtParse, jwtCheck } from '../middleware/JwtCheck';
import Controller from '../controller/orderController';

const router = express.Router()


router.route("/checkout/create-checkout-session").post(
    jwtCheck,
    JwtParse,
    Controller.createCheckOutSession
)
router.route("/checkout/webhook").post(Controller.stripeWebhookHandler)
router.route("/").get(jwtCheck,JwtParse,Controller.getMyorders)

export default router