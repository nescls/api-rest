/*
  Warnings:

  - Made the column `precioTotal` on table `Orden` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Orden" ALTER COLUMN "precioTotal" SET NOT NULL;
