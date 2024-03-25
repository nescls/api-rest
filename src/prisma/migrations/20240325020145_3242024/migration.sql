/*
  Warnings:

  - You are about to drop the column `disponibilidad` on the `Producto` table. All the data in the column will be lost.
  - Added the required column `stock` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "disponibilidad",
ADD COLUMN     "stock" INTEGER NOT NULL;
