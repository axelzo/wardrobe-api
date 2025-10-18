import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import clothingRoutes from './routes/clothing.routes.js';

// Inject env variables
dotenv.config();
console.log('[SERVER] Variables de entorno inicializadas.');

const app = express();
console.log('[SERVER] Express inicializado.');

// Middlewares
app.use((req, res, next) => {
  console.log(`[SERVER] Petición recibida: ${req.method} ${req.url}`);
  next();
});
console.log('[SERVER] Middleware CORS activado.');
app.use(cors());
console.log('[SERVER] Middleware JSON activado.');
app.use(express.json());

// Routes
console.log('[SERVER] Rutas /api/auth activadas.');
app.use('/api/auth', authRoutes);
console.log('[SERVER] Rutas /api/clothing activadas.');
app.use('/api/clothing', clothingRoutes);

app.get('/', (req, res) => {
  console.log('[SERVER] Ruta raíz / llamada.');
  res.send('Wardrobe API is running!');
});

export default app;