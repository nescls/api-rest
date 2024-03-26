import express from 'express'
import cors from 'cors'
import corsOpciones from './config/corsOpciones'
import userRouter from './routes/user'
import authRouter from './routes/auth'
import ordenesRouter from './routes/ordenes'
import productosRouter from './routes/productos'
import helmet from 'helmet';
import { queryParser } from 'express-query-parser'

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const puerto = process.env.PUERTO || 3000;

app.use(helmet());

app.use(express.json());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)

app.use(cors(corsOpciones)); //Rutas origenes permitidas

app.use('/api/users', userRouter);

app.use('/api/auth', authRouter);

app.use('/api/ordenes', ordenesRouter);

app.use('/api/productos', productosRouter);

const server = app.listen(puerto, () =>
  console.log(`
  Servidor escuchando a la ruta: http://localhost:${puerto}`),
)
