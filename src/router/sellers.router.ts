import express, {Request, Response} from 'express';
import SellersController from '../controllers/sellers.controller';
const router = express.Router();
const sellerCtrl = new SellersController();

router.use(express.json());


router.get('/', async(_, res:Response) => {
  const {code, data} = await sellerCtrl.get();
  res.status(code).json(data);
});

router.get('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await sellerCtrl.get(id);
  res.status(code).json(data);
});

router.post('/', async(req:Request, res:Response) => {
  const {code, data} = await sellerCtrl.post(req.body);
  res.status(code).json(data);
});

router.patch('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await sellerCtrl.update(id, req.body);
  res.status(code).json(data);
});

router.delete('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await sellerCtrl.delete(id);
  res.status(code).json(data);
});

export default router;