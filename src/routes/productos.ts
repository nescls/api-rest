import { Router } from 'express';
import { createProducto, getAllProductos, getProductoById, updateProducto, deleteProducto} from '../controllers/productosController'
import verifyJWT from '../controllers/middleware/verifyToken';
import verifyRoles from '../controllers/middleware/verifyRol';

const productosRouter = Router();

productosRouter.post('/crear',[verifyJWT, verifyRoles(2)], createProducto);

productosRouter.get('/', verifyJWT, getAllProductos);

productosRouter.get('/:id', verifyJWT,getProductoById);

productosRouter.patch('/:id', [verifyJWT, verifyRoles(2)],updateProducto);

productosRouter.delete('/:id', [verifyJWT, verifyRoles(2)], deleteProducto);

export default productosRouter;