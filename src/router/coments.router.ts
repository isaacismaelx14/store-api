import ComentsController from '../controllers/coments.controller';
import express, { Request, Response } from 'express';

const router = express.Router();
const comentsCtrl = new ComentsController();

router.use(express.json());

// Get
router.get('/', async (_, res: Response) => {
    const { code, data } = await comentsCtrl.get();
    res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { code, data } = await comentsCtrl.get(id);
    res.status(code).json(data);
});

router.get('/by-product/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { code, data } = await comentsCtrl.get(id, 'product_id');
    res.status(code).json(data);
});

router.get('/by-user/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { code, data } = await comentsCtrl.get(id, 'user_id');
    res.status(code).json(data);
});

// Post
router.post('/', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const { code, data } = await comentsCtrl.post(req.body, auth);
    res.status(code).json(data);
});

// Patch
router.patch('/:id', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const { code, data } = await comentsCtrl.update(id,req.body, auth);
    res.status(code).json(data);
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const { code, data } = await comentsCtrl.delete(id, auth);
    res.status(code).json(data);
});

export default router;
