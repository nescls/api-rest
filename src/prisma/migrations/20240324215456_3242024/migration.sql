/*
  Warnings:

  - Added the required column `precioProductos` to the `OrdenProductos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioUnd` to the `OrdenProductos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrdenProductos" ADD COLUMN     "precioProductos" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precioUnd" DOUBLE PRECISION NOT NULL;
