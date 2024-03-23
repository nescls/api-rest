import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import corsOpciones from './config/corsOpciones'
import userRouter from './routes/user'
import errorHandlerMiddleware from './controllers/middleware/errorHandleMiddleware'
import authRouter from './routes/auth'

const prisma = new PrismaClient()
const app = express()

app.use(express.json());

app.use(cors(corsOpciones)); //Rutas origenes permitidas

app.use('/users', userRouter);

app.use('/auth', authRouter);
/*
app.post(`/signup`, async (req, res) => {
  const { username , telefono, correo, password } = req.body

  const result = await prisma.user.create({
    data: {
      username,
      telefono,
      correo,
      password,
    },
  })
  res.json(result)
})*/

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/user/:id/drafts', async (req, res) => {
  const { id } = req.params

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })

  res.json(drafts)
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
