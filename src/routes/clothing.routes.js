import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
} from '../controllers/clothing.controller.js';

const router = Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

router.route('/').get(getClothingItems).post(createClothingItem);
router.route('/:id').put(updateClothingItem).delete(deleteClothingItem);

export default router;
