// src/config/prisma.js
import { PrismaClient } from '@prisma/client';
console.log('[PRISMA] Creando instancia de PrismaClient...');
const prisma = new PrismaClient();
console.log('[PRISMA] PrismaClient creado y exportado.');
export default prisma;
