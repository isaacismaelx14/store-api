import UsersController from '../controllers/users.controller';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const user = new UsersController();



router.use(express.json());

router.get('/', async (_, res: Response) => {
    const {code, data} = await user.get();
    res.status(code).json(data);
});

router.post('/', async (req: Request, res: Response) => {
    const {code, data}= await user.post(req.body);
    res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {code, data} = await user.get(id);
    res.status(code).json(data);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {code, data} = await user.delete(id);
    res.status(code).json(data);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const auth = req.get('authorization');
    const {code, data} = await user.putOrPatch(id, req.body, auth);
    res.status(code).json(data);
});

router.patch('/change-password/:id', async (req: Request, res:Response) => {
    const id = parseInt(req.params.id);
    const auth = req.get('authorization');
    const {code, data} = await user.ChangePwd(id, req.body, auth);
    res.status(code).json(data);
});

router.post('/login', async (req: Request, res:Response) => {
    const {code, data} = await user.Login(req.body);
    res.status(code).json(data);
});

export default router;