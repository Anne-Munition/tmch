import { Router } from 'express';
import userAuth from '../middleware/userAuth';
import authRoutes from './auth';
import searchRoutes from './search';

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.use('/auth', authRoutes);

router.use(userAuth);

router.get('/user', (req, res, next) => {
  res.status(200).json(req.user);
});

router.use('/search', searchRoutes);

export default router;
