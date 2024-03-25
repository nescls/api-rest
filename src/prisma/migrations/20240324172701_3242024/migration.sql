/*
  Warnings:

  - You are about to drop the column `status` on the `Orden` table. All the data in the column will be lost.
  - Added the required column `tipoOrden` to the `Orden` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoOrden" AS ENUM ('pickup', 'delivery');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "status",
ADD COLUMN     "estadoOrden" "EstadoOrden",
ADD COLUMN     "tipoOrden" "TipoOrden" NOT NULL;
