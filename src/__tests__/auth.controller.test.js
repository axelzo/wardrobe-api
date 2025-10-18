
import { register, login } from '../controllers/auth.controller.js';
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mockeamos las dependencias para aislar el controlador
jest.mock('../config/prisma.js', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    // Limpiamos los mocks antes de cada prueba para no tener datos residuales
    jest.clearAllMocks();

    // Mockeamos los objetos req (request) y res (response) de Express
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(), // Permite encadenar .status().json()
      json: jest.fn(),
    };
  });

  // Pruebas para la función de registro
  describe('register', () => {
    it('should create a user successfully', async () => {
      req.body = { name: 'test', email: 'test@example.com', password: 'password123' };
      
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({ id: 1, ...req.body });

      await register(req, res);

      // Verificamos que la función para crear un usuario en la BD fue llamada
      expect(prisma.user.create).toHaveBeenCalled();
      // Verificamos que el código de estado de la respuesta es 201 (Created)
      expect(res.status).toHaveBeenCalledWith(201);
      // Verificamos que la respuesta JSON contiene el mensaje de éxito y el ID del usuario
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', userId: 1 });
    });

    it('should return 409 if email already exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };

      // Simulamos el error de Prisma cuando un campo único (email) ya existe
      prisma.user.create.mockRejectedValue({ code: 'P2002' });

      await register(req, res);

      // Verificamos que el código de estado es 409 (Conflict)
      expect(res.status).toHaveBeenCalledWith(409);
      // Verificamos que la respuesta JSON contiene el mensaje de error apropiado
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should return 400 if email or password are not provided', async () => {
      req.body = { name: 'test' }; // Body sin email ni password

      await register(req, res);

      // Verificamos que el código de estado es 400 (Bad Request)
      expect(res.status).toHaveBeenCalledWith(400);
      // Verificamos que la respuesta JSON contiene el mensaje de error sobre campos requeridos
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });
  });

  // Pruebas para la función de login
  describe('login', () => {
    it('should login a user and return a token', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true); // Simulamos que la contraseña es correcta
      jwt.sign.mockReturnValue('fakeToken');

      await login(req, res);

      // Verificamos que se buscó al usuario por su email
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
      // Verificamos que se comparó la contraseña enviada con la hasheada de la BD
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
      // Verificamos que la respuesta JSON contiene el token de autenticación
      expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });

    it('should return 404 if user is not found', async () => {
      req.body = { email: 'notfound@example.com', password: 'password123' };

      prisma.user.findUnique.mockResolvedValue(null); // Simulamos que el usuario no se encuentra

      await login(req, res);

      // Verificamos que el código de estado es 404 (Not Found)
      expect(res.status).toHaveBeenCalledWith(404);
      // Verificamos la respuesta de error
      expect(res.json).toHaveBeenCalledWith({ message: 'User or Password are not valid' });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false); // Simulamos que la contraseña es incorrecta

      await login(req, res);

      // Verificamos que el código de estado es 401 (Unauthorized)
      expect(res.status).toHaveBeenCalledWith(401);
      // Verificamos la respuesta de error
      expect(res.json).toHaveBeenCalledWith({ message: 'User or Password are not valid' });
    });
  });
});
