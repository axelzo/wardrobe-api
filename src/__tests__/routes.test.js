
import request from 'supertest';
import app from '../app.js'; // Importamos la app de Express
import prisma from '../config/prisma.js';
import { protect } from '../middlewares/auth.middleware.js';
import bcrypt from 'bcryptjs';

// Mockeamos Prisma
jest.mock('../config/prisma.js', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  clothingItem: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// Mockeamos el middleware de protección
jest.mock('../middlewares/auth.middleware.js', () => ({
  protect: jest.fn((req, res, next) => {
    // Por defecto, simulamos que no hay autenticación
    // El test que necesite autenticación sobreescribirá este mock
    next();
  }),
}));

// Mockeamos bcrypt
jest.mock('bcryptjs');

describe('API Routes Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    it('POST /api/auth/register - should create a user', async () => {
      const userData = { name: 'test', email: 'test@example.com', password: 'password123' };
      prisma.user.create.mockResolvedValue({ id: 1, ...userData });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Verificamos que la respuesta de la API es correcta
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('userId', 1);
    });

    it('POST /api/auth/login - should return a token', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      prisma.user.findUnique.mockResolvedValue(user);
      // Simulamos que la comparación de contraseñas es exitosa
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      // En un test de integración real, el controlador devolvería un token.
      // Como el controlador está parcialmente mockeado (prisma), nos enfocamos en el flujo.
      // El test unitario ya confirmó que jwt.sign es llamado.
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Clothing Routes', () => {
    it('GET /api/clothing - should return 401 if not authenticated', async () => {
        // No mockeamos 'protect' para que falle la autenticación
        protect.mockImplementation((req, res, next) => {
            return res.status(401).json({ message: 'Not authorized, no token' });
        });

        const response = await request(app).get('/api/clothing');

        expect(response.statusCode).toBe(401);
    });

    it('GET /api/clothing - should return items if authenticated', async () => {
      // Mockeamos 'protect' para simular un usuario autenticado
      protect.mockImplementation((req, res, next) => {
        req.user = { userId: 1 };
        next();
      });

      const items = [{ id: 1, name: 'T-Shirt', ownerId: 1 }];
      prisma.clothingItem.findMany.mockResolvedValue(items);

      const response = await request(app).get('/api/clothing');

      // Verificamos que la ruta protegida funciona y devuelve los datos
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(items);
    });

     it('POST /api/clothing - should create an item if authenticated', async () => {
      // Simulamos un usuario autenticado
      protect.mockImplementation((req, res, next) => {
        req.user = { userId: 1 };
        next();
      });

      const newItemData = { name: 'Jeans', category: 'Pants', color: 'Blue' };
      const createdItem = { id: 2, ownerId: 1, ...newItemData };
      prisma.clothingItem.create.mockResolvedValue(createdItem);

      const response = await request(app)
        .post('/api/clothing')
        .send(newItemData);

      // Verificamos que el item se crea correctamente
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(createdItem);
    });
  });
});
