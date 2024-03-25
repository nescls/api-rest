import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ExtendedRequest } from '../common/types';
import { errorLogger } from '../config/loggerConfig';
import { validate } from 'email-validator';
const prisma = new PrismaClient();

// Función para registrar un nuevo usuario o creacion de usuario por parte del administrativo

async function registro(req: ExtendedRequest, res: Response) {
  const { username, telefono, direccion, correo, password, passwordConfirmation, rol } = req.body;

  if (rol && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado, solo administradores pueden crear usuarios con roles.' });
  }

  if (!username || !correo || !password || !passwordConfirmation) {
    return res.status(400).json({ message: 'Campos requeridos faltantes: nombre de usuario, correo electrónico, contraseña y confirmación de contraseña son obligatorios.' });
  }

  if (!validate(correo)) {
    return res.status(400).json({ message: 'Correo electrónico no válido.' });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  if (isNaN(telefono)) {
    return res.status(400).json({ message: 'El número de teléfono debe contener solo números.' });
  }

  if (rol && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado, solo administradores pueden crear usuarios con roles.' });
  }

  // Validación de campos obligatorios
  if (!username || !correo || !password) {
    return res.status(400).json({ message: 'Campos requeridos faltantes: nombre de usuario, correo electrónico y contraseña son obligatorios.' });
  }

  const hashedPwd = await bcrypt.hash(password, 10); // Contraseña encriptada
  try {
    // Buscar usuario existente por nombre de usuario o correo electrónico
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { correo },
        ],
      },
    });

    if (usuarioExistente) {
      const campoRepetido = usuarioExistente.username === username ? 'nombre de usuario' : 'correo electrónico'; // Campo duplicado
      const message = `${campoRepetido} ya en uso. Ingrese un valor distinto.`;
      return res.status(400).json({ message });
    }

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        username,
        telefono,
        correo,
        password: hashedPwd,
        direccion,
        rol
      },
    });

    res.status(201).json(newUser); // Regresar información del usuario creado
  } catch (error) {
    errorLogger.error(error);
    return res.status(500).json({ message: 'Ocurrió un error durante el registro. Intente más tarde.' });
  }
}


// Función para obtener todos los usuarios
async function getAllUsers(req: Request, res: Response) {
  const query = req.query
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  
  try {
    const opcionesFiltros = Object.keys(prisma.user.fields);//Se extraen los parametros permitidos para el filtrado del modelo
    const filtrosRequest = Object.fromEntries(
        Object.entries(query)
            .filter(([key]) => opcionesFiltros.includes(key)) 
    );

    const users = await prisma.user.findMany({
      where: {
        ...filtrosRequest
      },
      select: {
        id: true,
        username: true,
        telefono: true,
        direccion: true,
        correo: true,
        createdAt: true,
        deletedAt: true,
        isActive: true,
        rol: true,
        updatedAt: true,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return res.status(200).json({ users });
  } catch (error) {
    errorLogger.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}


// Función para obtener un usuario por ID
async function getUserById(req: ExtendedRequest, res: Response) {
  const { id } = req.params;

  // Validación de campo obligatorio
  if (!id) {
    return res.status(400).json({ message: 'Falta el ID del usuario.' });
  }

  /*solo se permite visualizar si el rol es administrador o el mismo usuario esta realizando la consulta,
 se podria realizar un middleware que realice esta validación */
  if (id != req.user?.id && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        telefono: true,
        direccion: true,
        correo: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    errorLogger.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}


// Función para editar la información de un usuario
async function editUser(req: ExtendedRequest, res: Response) {
  const user = req.body as User;
  const {username , correo}= req.body
  const { id } = req.params;

  /*solo se permite modificar si el rol es administrador o el mismo usuario esta realizando la modificación,
   se podria realizar un middleware que realice esta validación y pasar los roles permitidos que pueden modificar usuarios ajenos */
  if (id != req.user?.id && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (user.rol && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado, solo administradores pueden modificar roles de usuarios.' });
  }

  try {
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { correo },
        ],
      },
    });

    if (usuarioExistente  && usuarioExistente.id != Number(id)) {
      const campoRepetido = usuarioExistente.username === username ? 'nombre de usuario' : 'correo electrónico'; // Campo duplicado
      const message = `${campoRepetido} ya en uso. Ingrese un valor distinto.`;
      return res.status(400).json({ message });
    }

    // Buscar y actualizar el usuario en un solo paso con 'update'
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) }, // Asegurarse de que 'id' sea un número
      data: {
        correo: user.correo,
        direccion: user.direccion,
        telefono: user.telefono,
        username: user.username,
      },
      select: {
        username: true,
        telefono: true,
        direccion: true,
        correo: true,
        createdAt: true,
      },
    });

    if (!updatedUser) { // Validación de usuario existente
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Regresar la información del usuario actualizado
    return res.status(200).json({
      message: 'Usuario actualizado con éxito',
      updatedUser,
    });
  } catch (error) {
    errorLogger.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}


// Función para desactivar (borrar) un usuario
async function deleteUser(req: ExtendedRequest, res: Response) {
  const { id } = req.params;

  // Validación de campo obligatorio
  if (!id) {
    return res.status(400).json({ message: 'Cuerpo incompleto.' });
  }
  
    /*solo se permite modificar si el rol es administrador o el mismo usuario esta realizando la modificación,
   se podria realizar un middleware que realice esta validación y pasar los roles permitidos que pueden modificar usuarios ajenos */
   if (id != req.user?.id && req.user?.rol != 2) {
    return res.status(401).json({ message: 'No autorizado' });
  }


  try {
    // Desactivar el usuario y establecer marca de tiempo 'deletedAt'
    const now = new Date(); // Obtener marca de tiempo actual

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        isActive: false,
        deletedAt: now, // Timestamp del eliminado del usuario
      },
      select: {
        username: true,
        isActive: true,
      },
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario desactivado con éxito' });
  } catch (error) {
    errorLogger.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

export {
  registro,
  editUser,
  deleteUser,
  getUserById,
  getAllUsers
};
