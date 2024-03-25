import { Router } from 'express';
import {deleteUser, editUser, getUserById, getAllUsers, registro} from '../controllers/userController';
import verifyJWT from '../controllers/middleware/verifyToken';
import verifyRoles from '../controllers/middleware/verifyRol';

const userRouter = Router();

userRouter.post('/registro', registro);

userRouter.get('/',  [verifyJWT, verifyRoles(2)], getAllUsers);

userRouter.get('/:id', verifyJWT,getUserById);

userRouter.patch('/:id', [verifyJWT, verifyRoles(1,2)],editUser);

userRouter.delete('/:id', verifyJWT, deleteUser);

export default userRouter;