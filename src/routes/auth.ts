import { Router } from 'express';
import { handleLogin } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', handleLogin);

export default authRouter;