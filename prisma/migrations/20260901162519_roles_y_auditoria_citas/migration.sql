/*
  Warnings:

  - Added the required column `actualizadoEn` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "contactoId" TEXT,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPorId" TEXT,
    "actualizadoPorId" TEXT,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "Cita_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Contacto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cita_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cita_actualizadoPorId_fkey" FOREIGN KEY ("actualizadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cita" ("contactoId", "createdAt", "estado", "fechaFin", "fechaInicio", "id", "notas", "titulo") SELECT "contactoId", "createdAt", "estado", "fechaFin", "fechaInicio", "id", "notas", "titulo" FROM "Cita";
DROP TABLE "Cita";
ALTER TABLE "new_Cita" RENAME TO "Cita";
CREATE INDEX "Cita_fechaInicio_idx" ON "Cita"("fechaInicio");
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ASISTENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Usuario" ("activo", "createdAt", "email", "id", "name", "passwordHash", "username") SELECT "activo", "createdAt", "email", "id", "name", "passwordHash", "username" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
