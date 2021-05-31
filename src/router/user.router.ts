import UsersController from '../controllers/users.controller';
import express, { Request, Response } from 'express';

const router = express.Router();
const user = new UsersController();



router.use(express.json());

router.get('/', async (req:Request, res: Response) => {
    const auth = req.get('authorization');
    const {code, data} = await user.get(auth);
    res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const auth = req.get('authorization');
    const {code, data} = await user.get(auth, id);
    res.status(code).json(data);
});

router.post('/', async (req: Request, res: Response) => {
    const {code, data}= await user.post(req.body);
    console.log(data);
    res.status(code).json(data);
});


router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const auth = req.get('authorization');
    const {code, data} = await user.delete(id, auth);
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
