// script-create-user.js
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await hash('', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'RyZeno',
        email: 'gmail.com',
        password: hashedPassword,
        isPremium: true
      }
    });
    
    console.log('Utilisateur créé avec succès:', user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();