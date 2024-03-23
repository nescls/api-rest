import { Router } from 'express';
import {deleteUser, editUser, registro} from '../controllers/userController';
import verifyJWT from '../controllers/middleware/verifyToken';
import verifyRoles from '../controllers/middleware/verifyRol';

const userRouter = Router();

userRouter.post('/registro', registro);

userRouter.patch('/edit/:id', [verifyJWT, verifyRoles(1,2)],editUser);

userRouter.delete('/delete/:id', deleteUser);

export default userRouter;