import { Router } from 'express';
import {registro} from '../controllers/userController';

const userRouter = Router();

userRouter.post('/registro', registro);

export default userRouter;