/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Orden` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrdenProductos` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrdenProductos` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrdenProductos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ordenId,productoId]` on the table `OrdenProductos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cantidad` to the `OrdenProductos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordenId` to the `OrdenProductos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productoId` to the `OrdenProductos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrdenProductos" DROP CONSTRAINT "OrdenProductos_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrdenProductos" DROP CONSTRAINT "OrdenProductos_productId_fkey";

-- DropIndex
DROP INDEX "OrdenProductos_orderId_productId_key";

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "totalPrice",
ADD COLUMN     "precioTotal" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "OrdenProductos" DROP COLUMN "orderId",
DROP COLUMN "productId",
DROP COLUMN "quantity",
ADD COLUMN     "cantidad" INTEGER NOT NULL,
ADD COLUMN     "ordenId" INTEGER NOT NULL,
ADD COLUMN     "productoId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrdenProductos_ordenId_productoId_key" ON "OrdenProductos"("ordenId", "productoId");

-- AddForeignKey
ALTER TABLE "OrdenProductos" ADD CONSTRAINT "OrdenProductos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenProductos" ADD CONSTRAINT "OrdenProductos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
