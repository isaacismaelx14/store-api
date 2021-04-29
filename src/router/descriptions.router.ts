import DescriptionsController from '../controllers/descriptions.controller';
import express, { Request, Response } from 'express';

const router = express.Router();
const descriptionsCtrl = new DescriptionsController();

router.use(express.json());

// Get
router.get('/', async (_, res: Response) => {
  const { code, data } = await descriptionsCtrl.get();
  res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await descriptionsCtrl.get(id);
  res.status(code).json(data);
});

router.get('/by-product/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await descriptionsCtrl.get(id, 'product_id');
  res.status(code).json(data);
});

// Post
router.post('/', async (req: Request, res: Response) => {
  const { code, data } = await descriptionsCtrl.post(req.body);
  res.status(code).json(data);
});

// Patch
router.patch('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await descriptionsCtrl.update(id,req.body);
  res.status(code).json(data);
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await descriptionsCtrl.delete(id);
  res.status(code).json(data);
});

export default router;
