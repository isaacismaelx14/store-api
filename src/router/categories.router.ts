import express, {Request, Response}from 'express';
import CategoriesController from '../controllers/categories.controller';

const router = express.Router();
const categoriesCtrl = new CategoriesController();

router.use(express.json());

router.get('/', async(_, res:Response) => {
    const {code, data} = await categoriesCtrl.get();
    res.status(code).json(data);
});

router.get('/:id', async(req:Request, res:Response) => {
    const id = parseInt(req.params.id);
    const {code, data} = await categoriesCtrl.get(id);
    res.status(code).json(data);
});

router.post('/', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const {code, data} = await categoriesCtrl.post(req.body, auth);
    res.status(code).json(data);
});

router.patch('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await categoriesCtrl.update(id, req.body, auth);
    res.status(code).json(data);
});

router.delete('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await categoriesCtrl.delete(id, auth);
    res.status(code).json(data);
});

export default router;