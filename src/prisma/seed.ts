import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const dotenv = require('dotenv');
dotenv.config();
const claveBase64 = process.env.CLAVEBASE64 || 'MTIzNDU2Nzg=';

async function main() {
  const hashedPwd = await bcrypt.hash(claveBase64, 10); // Clave en encriptado base64 extraido de los env

  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      correo: 'admin@admin',
      password: hashedPwd,
      rol: 2, 
    },
  });

  console.log(`Usuario admin creado: ${adminUser.id}`);

  const products = await prisma.producto.createMany({
    data: [
      { nombre: 'Camisa', descripcion: 'Camisa de algodón talla M', precio: 25.99, stock: 10 },
      { nombre: 'Zapatos Deportivos', descripcion: 'Zapatos deportivos talla 42', precio: 79.99, stock: 5 },
      { nombre: 'Libro de Cocina', descripcion: 'Libro con recetas para principiantes', precio: 19.95, stock: 20 },
    ],
  });

  console.log('Seeded products:', products);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });