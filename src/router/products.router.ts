import ProductsController from '../controllers/products.controller';
import express, { Request, Response } from 'express';

const router = express.Router();
const productsCtrl = new ProductsController();

router.use(express.json());

router.get('/', async (_, res: Response) => {
  const { code, data } = await productsCtrl.get();
  res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await productsCtrl.get(id);
  res.status(code).json(data);
});

router.post('/', async (req: Request, res: Response) => {
  const { code, data } = await productsCtrl.post(req.body);
  res.status(code).json(data);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await productsCtrl.patch(id,req.body);
  res.status(code).json(data);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await productsCtrl.delete(id);
  res.status(code).json(data);
});

export default router;
