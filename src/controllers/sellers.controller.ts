import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JwtController from './Jwt.controller';

interface seller {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  direction: string;
  rank?: number;
  accepted_by?: number;
  created_date?: Date;
}

const db = new Database('sellers', dbConfig);
const errors = new Errors();
const jwtCtrl = new JwtController();

const sellerData = (Seller: seller): queryParam => [
    { selector: 'user_id', value: Seller.user_id },
    { selector: 'name', value: Seller.name },
    { selector: 'description', value: Seller.description },
    { selector: 'direction', value: Seller.direction },
    { selector: 'rank', value: Seller.rank },
    { selector: 'accepted_by', value: Seller.accepted_by },
];

class SellersController {
    async get(data:{auth?:string, id?: number}): Promise<dataResponse> {
        const {auth, id}= data;
        const options: options = { where: { selector: 'id', value: id } };
        const resp = await db.select('*', id ? options : null);
        
        if(id){
            if(!auth || !(await jwtCtrl.checkToken(auth, {id, type:2}))) return errors.notAuth;
            return resp;
        }
        if(!auth || !(await jwtCtrl.checkToken(auth, {type:2}))) return errors.notAuth;
        return resp;
    }

    async post(Seller: seller, auth?:string): Promise<dataResponse> {
        const {description,  name,  user_id} = Seller;

        if(!auth || !(await jwtCtrl.checkToken(auth))) return errors.notAuth;
        const userId = jwtCtrl.getTokenData(auth).data?.id;

        if(!userId)  return errors.allNeeded;
        Seller.accepted_by = userId;

        if(!description || !name  || user_id === undefined) return errors.allNeeded;

        return await db.insert(sellerData(Seller));
        // return errors.create(200, 's'); //for tests    
    }

    async update(id: number, Seller: seller, auth?:string): Promise<dataResponse> {
        const {description, direction, name, rank} = Seller;

        if(Seller.id || Seller.user_id || Seller.accepted_by) return errors.idCannotChange;
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getUserId(id)}))) return errors.notAuth;
        if(!description && !direction && !name && rank === undefined  ) return errors.requestEmpty;
        
        return await db.update(sellerData(Seller), { selector: 'id', value: id });
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getUserId(id)}))) return errors.notAuth;
        return await db.delete({ selector: 'id', value: id });
        // return {code:201, data:'deleted'};

    }

    private async getUserId(sellerId:number){
        const req = await this.get({id:sellerId});
        const {user_id} = req.data;
        return user_id;
    }
}

export default SellersController;
