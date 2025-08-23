import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  console.log('[AUTH] Petición de registro. Body:', req.body);
  const { name, email, password } = req.body;

  if (!email || !password) {
    console.log('[AUTH] Faltan email o password.');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[AUTH] Password hasheado.');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log('[AUTH] Usuario creado:', user.id);
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('[AUTH] Email ya existe:', email);
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('[AUTH] Error en registro:', error);
    res.status(500).json({ message: 'Internal server error'});
  }
};

export const login = async (req, res) => {
  console.log('[AUTH] Petición de login. Body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('[AUTH] Faltan email o password.');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('[AUTH] Usuario no encontrado:', email);
      return res.status(404).json({ message: 'User or Password are not valid' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('[AUTH] Password incorrecto para usuario:', email);
      return res.status(401).json({ message: 'User or Password are not valid' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('[AUTH] Login exitoso. Token generado para usuario:', user.id);
    res.json({ token });

  } catch (error) {
    console.error('[AUTH] Error en login:', error);
    res.status(500).json({ message: 'Internal server error'});
  }
};
