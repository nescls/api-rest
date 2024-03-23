-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "telefono" TEXT,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "rol" INTEGER NOT NULL DEFAULT 1,
    "refreshToken" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_correo_key" ON "user"("correo");
