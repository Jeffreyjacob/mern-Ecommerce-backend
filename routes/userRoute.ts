import express from 'express';
import Controller from '../controller/userController';
import { jwtCheck } from '../middleware/JwtCheck';

const router = express.Router();


router.route('/').post(jwtCheck,Controller.createUser)


export default router;