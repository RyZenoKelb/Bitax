// Vérifie ton fichier lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// PrismaClient instance avec gestion d'erreur
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma