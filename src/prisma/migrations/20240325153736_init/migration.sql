/*
  Warnings:

  - You are about to drop the `Orden` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrdenProductos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrdenProductos" DROP CONSTRAINT "OrdenProductos_ordenId_fkey";

-- DropForeignKey
ALTER TABLE "OrdenProductos" DROP CONSTRAINT "OrdenProductos_productoId_fkey";

-- DropTable
DROP TABLE "Orden";

-- DropTable
DROP TABLE "OrdenProductos";

-- DropTable
DROP TABLE "Producto";

-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "direccion" TEXT,
    "tipoOrden" "TipoOrden" NOT NULL,
    "estadoOrden" "EstadoOrden",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenProductos" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnd" DOUBLE PRECISION NOT NULL,
    "precioProductos" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ordenProductos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "producto_nombre_key" ON "producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ordenProductos_ordenId_productoId_key" ON "ordenProductos"("ordenId", "productoId");

-- AddForeignKey
ALTER TABLE "orden" ADD CONSTRAINT "orden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenProductos" ADD CONSTRAINT "ordenProductos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenProductos" ADD CONSTRAINT "ordenProductos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
