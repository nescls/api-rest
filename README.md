
# ApiRest

API REST para una plataforma de comercio electronico

## Empezar

### 1. Clonar el repositorio e instalar dependencias

Clonar el repo:

```
git clone https://github.com/nescls/api-rest
```

Instalar npm dependencias:

```
api-rest
npm install
```

### 2. Crea e inicializa la base de datos

Editar la conexión con la base de datos y ejecutar el siguiente comando para crear el archivo de base de datos seleccionado

```
npx prisma migrate dev --nombre init
```

Cuando se ejecuta npx prisma migrate dev contra una base de datos recién creada, también se activa la inicialización. Se ejecutará el archivo de inicialización en prisma/seed.ts

En el caso que no, correr:

```
npx prisma db seed
```
Crear el archivo .env tomando .env.example como ejemplo y sustituir los datos deseados

### 3. Iniciar el servidor API REST

```
npm run dev
```

El servidor correra `http://localhost:` y el puerto asignado en el archivo .env. En el caso de no definir el puerto se asigna el puerto 3000



## API Reference

### Crud de usuario

#### Registrar usuario


```http
  POST /api/users/registro
```

| Parametros | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| username | string | **Requerido.** Nombre de usuario |
| telefono | string | Número de teléfono |
| direccion | string | Dirección |
| correo | string |**Requerido.** Correo electrónico |
| password | string | **Requerido.** Contraseña |
| passwordConfirmation | string | **Requerido.** Confirmación de contraseña |

Ejemplo: 

```
{
   "username": "prueba",
   "correo": "prueba@prueba.com",
   "password":"MTIzNDU2Nzg=",
   "passwordConfirmation":"MTIzNDU2Nzg="
}
```

Respuesta:
```
{
    "id": 6,
    "username": "prueba",
    "telefono": null,
    "direccion": null,
    "correo": "prueba@prueba.com",
    "createdAt": "2024-03-26T00:05:21.202Z",
    "isActive": true
}
```

#### Crear usuario

Para esta ruta requiere token y es solo accesible por el rol de administrador

```http
  POST /api/users/crear
```

| Parametros | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| username | string | **Requerido.** Nombre de usuario |
| telefono | string | Número de teléfono |
| direccion | string | Dirección |
| correo | string |**Requerido.** Correo electrónico |
| password | string | **Requerido.** Contraseña |
| passwordConfirmation | string | **Requerido.** Confirmación de contraseña |
| rol | int | Asignacion de rol |

Ejemplo: 

```
{
   "username": "prueba",
   "correo": "prueba@prueba.com",
   "password":"MTIzNDU2Nzg=",
   "passwordConfirmation":"MTIzNDU2Nzg="
}
```

Respuesta:
```
{
    "id": 6,
    "username": "prueba",
    "telefono": null,
    "direccion": null,
    "correo": "prueba@prueba.com",
    "createdAt": "2024-03-26T00:05:21.202Z",
    "isActive": true
}
```

#### Lista de usuarios

Para esta ruta requiere token y es solo accesible por el rol de administrador

```http
  GET /api/users/
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| username | string |  Nombre de usuario |
| telefono | string | Número de teléfono |
| direccion | string | Dirección |
| correo | string | Correo electrónico |
| password | string |  Contraseña |
| passwordConfirmation | string | Confirmación de contraseña |
| rol | number | Rol del usuario (1: Usuario cliente, 2: Administrador) |

Ejemplo: 

```
GET /api/users?rol=1
```

Respuesta:
Listado de usuarios de rol 1 (Clientes)

#### Busqueda de un usuario

Para esta ruta requiere token y el usuario Cliente solo puede acceder a su propio id de usuario, el adminsitrador tiene acceso a todos los usarios

```http
  GET /api/users/:id
```


Ejemplo: 

```
GET /api/users/1
```

Respuesta:
```
{
    "user": {
        "id": 1,
        "username": "prueba",
        "telefono": "12345678910",
        "direccion": "Tazon",
        "correo": "manolo@mail.com",
        "createdAt": "2024-03-25T15:32:27.793Z"
    }
}
```

#### Editar usuario

Para esta ruta requiere token y  el usuario Cliente solo puede modificar a su propio id de usuario, el adminsitrador tiene acceso a todos los usarios. En el caso de los roles solo un administrador puede modificar roles en un usuario.

```http
  PATCH /api/users/:id
```

| Parametros | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| username | string |  Nombre de usuario |
| telefono | string | Número de teléfono |
| direccion | string | Dirección |
| correo | string | Correo electrónico |
| rol | number | Rol del usuario (1: Usuario cliente, 2: Administrador) |


Ejemplo: 

```
{
   "username": "prueba",
   "correo": "prueba@prueba.com",
    "telefono": "04166974088",
   "direccion":"prueba"
}
```

Respuesta:
```
{
    "message": "Usuario actualizado con éxito",
    "updatedUser": {
        "username": "prueba",
        "telefono": "04166974088",
        "direccion": "prueba",
        "correo": "prueba@prueba.com",
        "createdAt": "2024-03-26T00:05:21.202Z"
    }
}
```

#### Eliminado de un usuario

Para esta ruta requiere token y el usuario Cliente solo puede borrar a su propio usuario, el adminsitrador tiene acceso a todos los usarios.

```http
  DELETE /api/users/:id
```


Ejemplo: 

```
DELETE /api/users/1
```

Respuesta:
```
{
    "message": "Usuario desactivado con éxito"
}

```

### Autenticación

#### Inicio de sesión


```http
  POST /api/auth/login
```

| Parametros | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| username/correo | string | **Requerido.** Nombre de usuario o correo |
| password | string | **Requerido.** Contraseña |


Ejemplo: 

```
{
   "correo": "prueba@prueba.com",
   "password":"MTIzNDU2Nzg="
}
```

Respuesta:
```
{
    "accessToken": "token"
}
```

### Productos

#### Crear Productos

Para esta ruta requiere token y es solo accesible por el rol de administrador

```http
  POST /api/productos/crear
```

| Parámetro | Tipo | Descripción | Requerido |
|---|---|---|---|
| nombre | string | Requerido. Nombre del producto | Sí |
| descripcion | string | Descripción del producto | Sí |
| precio | number | Precio del producto | Sí |
| stock | number |Stock del producto | Sí |
| isActive | bool |Producto disponible | No |

Ejemplo: 

```
{
    "nombre": "Escoba",
    "descripcion": "Escoba de madera",
    "precio": 10,
    "stock": 5,
    "isActive": true
}
```

Respuesta:
```
{
    "id": 4,
    "nombre": "Escoba",
    "descripcion": "Escoba de madera",
    "precio": 10,
    "stock": 5,
    "isActive": true,
    "createdAt": "2024-03-25T17:17:12.704Z",
    "updatedAt": "2024-03-25T17:17:12.704Z",
    "deletedAt": null
}

```

#### Lista de Productos

Para esta ruta requiere token, los productos no activos son solo visibles por un administrador

```http
  GET /api/productos/
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Int | ID único del producto |
| nombre | String | Nombre del producto |
| descripcion | String | Descripción del producto |
| precio | Float | Precio del producto |
| stock | Int | Stock del producto |
| isActive | Bool | Estado activo del producto |

Ejemplo: 

```
GET /api/productos?stock=1
```

Respuesta:
Listado de productos con stock de 1

#### Busqueda de un producto

Para esta ruta requiere token, los productos no activos son solo visibles por un administrador.

```http
  GET /api/productos/:id
```


Ejemplo: 

```
GET /api/productos/1
```

Respuesta:
```
{
    "id": 2,
    "nombre": "Zapatos Deportivos",
    "descripcion": "Zapatos deportivos talla 42",
    "precio": 79.99,
    "stock": 6,
    "isActive": true,
    "createdAt": "2024-03-25T15:39:40.506Z"
}
```

#### Editar Producto

Para esta ruta requiere token y es solo accesible por un administrador.

```http
  PATCH /api/productos/:id
```

| Parámetro | Tipo | Descripción | 
|---|---|---|
| nombre | string | Requerido. Nombre del producto |
| descripcion | string | Descripción del producto |
| precio | number | Precio del producto |
| stock | number |Stock del producto |
| isActive | bool |Producto disponible |


Ejemplo: 

```
{
    "nombre": "Escoba",
    "descripcion": "Escoba de madera",
    "precio": 10,
    "stock": 5,
    "isActive": true
}
```

Respuesta:
```
{
    "message": "Producto actualizado con éxito",
    "productoActualizado": {
        "id": 1,
        "nombre": "Escobas",
        "descripcion": "Escobas de madera",
        "precio": 10,
        "stock": 5,
        "isActive": true,
        "createdAt": "2024-03-25T15:39:40.506Z",
        "updatedAt": "2024-03-25T15:39:40.506Z",
        "deletedAt": "2024-03-25T18:04:50.345Z"
    }
}
```

#### Eliminado de un producto

Para esta ruta requiere token y es solo accesible por un administrador.

```http
  DELETE /api/producto/:id
```


Ejemplo: 

```
DELETE /api/productos/1
```

Respuesta:
```
{
    "message": "Producto eliminado"
}

```

### Ordenes

#### Crear Orden

Para esta ruta requiere token. Para la creacion de ordenes, en el caso de los usarios las ordenes se asignan 

```http
  POST /api/ordenes/crear
```

| Parámetro | Tipo | Descripción | Requerido |
|---|---|---|---|
| tipoOrden | string | Requerido. Tipo de orden ("pickup","delivery")| Sí |
| productos | array | Id del producto y su cantidad | Sí |
| idUsuario | number | Id del usuario realizando la orden (Solo administradores) | No |
| direccion | string | Dirección de la orden | Sí (En caso de delivery) |


Ejemplo: 

```
{
    "tipoOrden": "pickup",
    "productos": [ {
        "id": 2,
        "cantidad":1
    },
    {
        "id": 4,
        "cantidad":1
    }],
    "idUsuario":3 
}
```

Respuesta:
```
{
    "id": 4,
    "userId": 3,
    "precioTotal": 89.99,
    "direccion": null,
    "tipoOrden": "pickup",
    "estadoOrden": "PENDIENTE",
    "createdAt": "2024-03-25T18:34:49.598Z",
    "updatedAt": "2024-03-25T18:34:49.598Z",
    "deletedAt": null,
    "ordenProductos": [
        {
            "id": 7,
            "ordenId": 4,
            "productoId": 2,
            "cantidad": 1,
            "precioUnd": 79.99,
            "precioProductos": 79.99
        },
        {
            "id": 8,
            "ordenId": 4,
            "productoId": 4,
            "cantidad": 1,
            "precioUnd": 10,
            "precioProductos": 10
        }
    ]
}

```

#### Lista de Ordenes

Para esta ruta requiere token, los usuarios clientes solo podran visualizar sus propias ordenes, los administradores tienes acceso a todas las ordenes

```http
  GET /api/ordenes
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| id | Int | ID único del pedido |
| user | User | Usuario que realizó el pedido |
| userId | Int | ID del usuario que realizó el pedido |
| precioTotal | Float | Precio total del pedido |
| direccion | String | Dirección de entrega del pedido |
| tipoOrden | TipoOrden | Tipo de orden (pickup, delivery) |
| estadoOrden | EstadoOrden | Estado del pedido (PENDIENTE, EN_PROCESO, FINALIZADO, CANCELADO) |

Ejemplo: 

```
GET /api/ordenes?estadoOrden =PENDIENTE
```

Respuesta:
Listado de ordenes cuyo estatus sea "PENDIENTE"

#### Busqueda de un Ordenes

Para esta ruta requiere token, los usuarios clientes solo podran visualizar si la orden les pertenece, el administrador tiene acceso a todas las ordenes.

```http
  GET /api/Ordenes/:id
```


Ejemplo: 

```
GET /api/Ordenes/1
```

Respuesta:
```
{
    "id": 1,
    "userId": 1,
    "precioTotal": 169.98,
    "direccion": "Tazon",
    "tipoOrden": "delivery",
    "estadoOrden": "CANCELADO",
    "createdAt": "2024-03-25T18:25:25.569Z",
    "updatedAt": "2024-03-25T18:25:25.569Z",
    "deletedAt": null,
    "ordenProductos": [
        {
            "id": 1,
            "ordenId": 1,
            "productoId": 2,
            "cantidad": 2,
            "precioUnd": 79.99,
            "precioProductos": 159.98,
            "producto": {
                "id": 2,
                "nombre": "Zapatos Deportivos",
                "descripcion": "Zapatos deportivos talla 42",
                "precio": 79.99,
                "stock": 6,
                "isActive": true,
                "createdAt": "2024-03-25T15:39:40.506Z",
                "updatedAt": "2024-03-25T15:39:40.506Z",
                "deletedAt": null
            }
        },
        {
            "id": 2,
            "ordenId": 1,
            "productoId": 4,
            "cantidad": 1,
            "precioUnd": 10,
            "precioProductos": 10,
            "producto": {
                "id": 4,
                "nombre": "Escoba",
                "descripcion": "Escoba de madera",
                "precio": 10,
                "stock": 2,
                "isActive": true,
                "createdAt": "2024-03-25T17:17:12.704Z",
                "updatedAt": "2024-03-25T17:17:12.704Z",
                "deletedAt": null
            }
        }
    ]
}
```

#### Editar Orden

Para esta ruta requiere token y es solo accesible por un administrador. Si la orden cambia de tipo a delivery, el campo de dirección es requerido.

```http
  PATCH /api/ordenes/:id
```

| Parámetro | Tipo | Descripción | 
|---|---|---|
| tipoOrden | string | Tipo de orden |
| estadoOrden | string | Estatus de la orden |
| direccion | string | Dirección de la orden |


Ejemplo: 

```
{
    "tipoOrden": "delivery",
	"estadoOrden": "PENDIENTE",
	"direccion": "Tazon",
}
```

Respuesta:
```
{
    "message": "Orden actualizado con éxito",
    "pedidoActualizado": {
        "id": 1,
        "userId": 1,
        "precioTotal": 169.98,
        "direccion": "Tazon",
        "tipoOrden": "delivery",
        "estadoOrden": "PENDIENTE",
        "createdAt": "2024-03-25T18:25:25.569Z",
        "updatedAt": "2024-03-25T18:25:25.569Z",
        "deletedAt": null
    }
}
```

#### Eliminado de una orden

Para esta ruta requiere token, el usuario solo puede cancelar ordenes suyas y que no esten en estatus ("CANCELADO", "FINAlIZADO"), al igual que el administrado con ordenes ajenas. Se retorna los productos al stock.

```http
  DELETE /api/ordenes/:id
```


Ejemplo: 

```
DELETE /api/ordenes/1
```

Respuesta:
```
{
    "message": "Pedido cancelado"
}

```
