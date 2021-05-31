import { SellerReqController } from '../../controllers/requests/sellers.controllers';
import express, { Request, Response } from 'express';

const router = express.Router();
const sellerCtrl = new SellerReqController();
router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const { code, data } = await sellerCtrl.getAll(auth);
    res.status(code).json(data);
});

router.get('/:id', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const { code, data } = await sellerCtrl.getById(id, auth);
    res.status(code).json(data);
});

router.post('/accept/:id', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const { code, data } = await sellerCtrl.accetRequest(id, auth);
    res.status(code).json(data);
});

router.post('/', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const { code, data } = await sellerCtrl.post(req.body, auth);
    res.status(code).json(data);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const auth = req.get('authorization');
    const id = parseInt(req.params.id);
    const { code, data } = await sellerCtrl.putOrPatch(id, req.body, auth);
    res.status(code).json(data);
});

export default router;
