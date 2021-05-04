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
    const auth = req.get('authorization');
    const {code, data} = await questionsCtrl.post(req.body, auth);
    
    res.status(code).json(data);
});

router.patch('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await questionsCtrl.update(id, req.body, auth);
    res.status(code).json(data);
});
  
router.delete('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await questionsCtrl.delete(id, auth);
    res.status(code).json(data);
});


export default router;