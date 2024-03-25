import { Router } from 'express';
import {cancelOrden, createOrden, getAllOrdenes, getOrdenById, updateOrden} from '../controllers/ordenesController'
import verifyJWT from '../controllers/middleware/verifyToken';
import verifyRoles from '../controllers/middleware/verifyRol';

const ordenesRouter = Router();

ordenesRouter.post('/crear', verifyJWT, createOrden);

ordenesRouter.get('/', verifyJWT, getAllOrdenes);

ordenesRouter.get('/:id', verifyJWT ,getOrdenById);

ordenesRouter.patch('/:id', [verifyJWT, verifyRoles(2)],updateOrden);

ordenesRouter.delete('/:id', [verifyJWT], cancelOrden);

export default ordenesRouter;