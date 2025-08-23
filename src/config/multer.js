
import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('[MULTER] Guardando archivo en ./uploads/');
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log(`[MULTER] Nombre generado para el archivo: ${filename}`);
    cb(null, filename);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  console.log(`[MULTER] Verificando tipo de archivo: ${file.originalname}, mimetype: ${file.mimetype}`);
  if (mimetype && extname) {
    console.log('[MULTER] Archivo permitido.');
    return cb(null, true);
  } else {
    console.log('[MULTER] Error: Solo se permiten imágenes.');
    cb('Error: Images Only!');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
