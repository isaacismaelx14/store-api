import express, {Request, Response} from 'express';
import SellersController from '../controllers/sellers.controller';
const router = express.Router();
const sellerCtrl = new SellersController();

router.use(express.json());


router.get('/', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const {code, data} = await sellerCtrl.get({auth});
    res.status(code).json(data);
});

router.get('/:id', async(req:Request, res:Response) => {
    const id = parseInt(req.params.id);
    const auth = req.get('authorization');
    const {code, data} = await sellerCtrl.get({auth, id});
    res.status(code).json(data);
});

router.post('/', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const {code, data} = await sellerCtrl.post(req.body, auth);
    res.status(code).json(data);
});

router.patch('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await sellerCtrl.update(id, req.body, auth);
    res.status(code).json(data);
});

router.delete('/:id', async(req:Request, res:Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const {code, data} = await sellerCtrl.delete(id, auth);
    res.status(code).json(data);
});


export default router;