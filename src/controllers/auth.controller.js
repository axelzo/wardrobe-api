// CAMBIO 1: Importar el modelo User de Mongoose en lugar del cliente de Prisma.
import User from '../models/user.model.js';
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
    
    // CAMBIO 2: Usar el método User.create de Mongoose para guardar el nuevo usuario.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    // Usar user._id, que es el ID por defecto en MongoDB.
    console.log('[AUTH] Usuario creado:', user._id); 
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    // CAMBIO 3: Manejar el error de clave duplicada de Mongoose (código 11000).
    if (error.code === 11000) {
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
    // CAMBIO 4: Usar el método findOne de Mongoose para encontrar al usuario por email.
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[AUTH] Usuario no encontrado:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('[AUTH] Password incorrecto para usuario:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // CAMBIO 5: Firmar el token JWT con user._id.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('[AUTH] Login exitoso. Token generado para usuario:', user._id);
    res.json({ token });

  } catch (error) {
    console.error('[AUTH] Error en login:', error);
    res.status(500).json({ message: 'Internal server error'});
  }
};
