import express from 'express';
import Seller from './router/requests/sellers.router';

const router = express.Router();

router.use('/seller', Seller);

export default router;