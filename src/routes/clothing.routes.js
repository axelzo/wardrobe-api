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

router.route('/').get(getClothingItems).post(upload.single('image'), createClothingItem);
router.route('/:id').put(upload.single('image'), updateClothingItem).delete(deleteClothingItem);

export default router;
