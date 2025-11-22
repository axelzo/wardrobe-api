
import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import connectDB from './config/database.js'; // Import connectDB

console.log('[SERVER] Iniciando Wardrobe API...');

// Connect to Database
connectDB(); // Call connectDB to establish connection

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
console.log(`[SERVER] __filename: ${__filename}`);
const __dirname = path.dirname(__filename);
 console.log(`[SERVER] __dirname: ${__dirname}`);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[SERVER] Wardrobe API corriendo en http://localhost:${PORT}`);
});
