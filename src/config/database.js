import mongoose from 'mongoose'; // Importa la librería mongoose para la conexión a MongoDB.
import dotenv from 'dotenv'; // Importa dotenv para cargar variables de entorno desde un archivo .env.

dotenv.config(); // Carga las variables de entorno definidas en el archivo .env en process.env.

// Define la URI de conexión a MongoDB.
// Intenta usar la variable de entorno MONGODB_URI, si no está disponible, usa una cadena de conexión predeterminada.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wardrobe';

// Define una función asíncrona para conectar a la base de datos MongoDB.
const connectDB = async () => {
  try {
    // Intenta establecer la conexión a MongoDB usando la URI especificada.
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected'); // Imprime un mensaje en la consola si la conexión es exitosa.
  } catch (error) {
    // Captura cualquier error que ocurra durante el intento de conexión.
    console.error('Error connecting to MongoDB:', error.message); // Imprime el error en la consola.
    process.exit(1); // Termina el proceso de la aplicación con un código de error.
  }
};

export default connectDB; // Exporta la función connectDB para que pueda ser utilizada en otras partes de la aplicación.
