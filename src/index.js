import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import clothingRoutes from './routes/clothing.routes.js';
console.log('[SERVER] Iniciando Wardrobe API...');

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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

// Serve static files
console.log('[SERVER] Servidor de archivos estáticos /uploads activado.');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
console.log('[SERVER] Rutas /api/auth activadas.');
app.use('/api/auth', authRoutes);
console.log('[SERVER] Rutas /api/clothing activadas.');
app.use('/api/clothing', clothingRoutes);

app.get('/', (req, res) => {
  console.log('[SERVER] Ruta raíz / llamada.');
  res.send('Wardrobe API is running!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[SERVER] Wardrobe API corriendo en http://localhost:${PORT}`);
});
