import express, { Request, Response } from 'express';
import AnswersController from '../controllers/answers.controller';

const router = express.Router();
const answersCtrl = new AnswersController();

router.use(express.json());

router.get('/', async (_, res: Response) => {
  console.log('get');
  const { code, data } = await answersCtrl.get();
  res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await answersCtrl.get(id);
  res.status(code).json(data);
});

router.post('/', async (req: Request, res: Response) => {
  const { code, data } = await answersCtrl.post(req.body);
  res.status(code).json(data);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await answersCtrl.update(id, req.body);
  res.status(code).json(data);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { code, data } = await answersCtrl.delete(id);
  res.status(code).json(data);
});

export default router;
