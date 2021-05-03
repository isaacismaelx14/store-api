import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';

interface seller {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  direction: string;
  rank: number;
  created_date?: Date;
}

const db = new Database('sellers', dbConfig);
const errors = new Errors();

const sellerData = (Seller: seller): queryParam => [
    { selector: 'user_id', value: Seller.user_id },
    { selector: 'name', value: Seller.name },
    { selector: 'description', value: Seller.description },
    { selector: 'direction', value: Seller.direction },
    { selector: 'rank', value: Seller.rank },
];

class SellersController {
    async get(id?: number): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Seller: seller): Promise<dataResponse> {
        const {description, direction, name, rank, user_id} = Seller;
        if(description && direction && name && rank !== undefined && user_id)
            return await db.insert(sellerData(Seller));
        else return errors.allNeeded;
    }

    async update(id: number, Seller: seller): Promise<dataResponse> {
        if(Seller.id || Seller.user_id) return errors.idCannotChange;
        const {description, direction, name, rank} = Seller;
        if(description || direction || name || rank !== undefined )
            return await db.update(sellerData(Seller), { selector: 'id', value: id });
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default SellersController;
