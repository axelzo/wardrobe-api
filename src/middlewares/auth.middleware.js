import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  console.log('[MIDDLEWARE] Verificando token:', token);

  if (!token) {
    console.log('[MIDDLEWARE] No se proporcionó token.');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[MIDDLEWARE] Token válido. Usuario decodificado:', decoded);
    req.user = decoded; // Adds user payload to request
    next();
  } catch (error) {
    console.log('[MIDDLEWARE] Token inválido:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
