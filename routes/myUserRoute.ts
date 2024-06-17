import express from 'express';
import { JwtParse, jwtCheck } from '../middleware/JwtCheck';
import Controller from '../controller/myUserController';
import {validateMyUserRequest} from '../middleware/Validation'


const router = express.Router();

router.route("/update").put(jwtCheck,JwtParse,validateMyUserRequest,Controller.UpdateUser)
router.route("/").get(jwtCheck,JwtParse,Controller.getUser)


export default router;