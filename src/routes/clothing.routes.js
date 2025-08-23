import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
} from '../controllers/clothing.controller.js';

const router = Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

router.route('/')
  .get((req, res, next) => {
    console.log('[ROUTE] GET /api/clothing llamada');
    next();
  }, getClothingItems)
  .post(upload.single('image'), (req, res, next) => {
    console.log('[ROUTE] POST /api/clothing llamada');
    next();
  }, createClothingItem);
router.route('/:id')
  .put(upload.single('image'), (req, res, next) => {
    console.log('[ROUTE] PUT /api/clothing/:id llamada');
    next();
  }, updateClothingItem)
  .delete((req, res, next) => {
    console.log('[ROUTE] DELETE /api/clothing/:id llamada');
    next();
  }, deleteClothingItem);

export default router;
