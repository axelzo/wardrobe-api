import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', (req, res, next) => {
	console.log('[ROUTE] POST /api/auth/register llamada');
	next();
}, register);
router.post('/login', (req, res, next) => {
	console.log('[ROUTE] POST /api/auth/login llamada');
	next();
}, login);

export default router;
