import express, {Request, Response} from 'express';
import QuestionController from '../controllers/questions.controller';

const router = express.Router();
const questionsCtrl = new QuestionController();

router.use(express.json());

router.get('/', async(_, res:Response) => {
  const {code, data} = await questionsCtrl.get();
  res.status(code).json(data);
});

router.get('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await questionsCtrl.get(id);
  res.status(code).json(data);
});

router.post('/', async(req:Request, res:Response) => {
  const {code, data} = await questionsCtrl.post(req.body);
  res.status(code).json(data);
});

router.patch('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await questionsCtrl.update(id, req.body);
  res.status(code).json(data);
});
  
router.delete('/:id', async(req:Request, res:Response) => {
  const id = parseInt(req.params.id);
  const {code, data} = await questionsCtrl.delete(id);
  res.status(code).json(data);
});


export default router;