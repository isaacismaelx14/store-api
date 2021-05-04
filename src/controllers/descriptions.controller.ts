import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JwtController from '../function/jws';
import SellerController from './sellers.controller';
import ProductController from './products.controller';

interface description {
  id?: number;
  product_id: number;
  color: string;
  brand: string;
  dimensions: string;
  weigth: string;
  other: string;
}

const db = new Database('descriptions', dbConfig);
const errors = new Errors();
const jwtCtrl = new JwtController();
const sellerCtrl = new SellerController();
const productCtrl = new ProductController();

const descriptionData = (Description: description): queryParam => [
    { selector: 'product_id', value: Description.product_id },
    { selector: 'color', value: Description.color },
    { selector: 'dimensions', value: Description.dimensions },
    { selector: 'brand', value: Description.brand },
    { selector: 'weigth', value: Description.weigth },
    { selector: 'other', value: Description.other },
];

class DescriptionsController {
    private type = 1;
    async get(id?: number, selector = 'id'): Promise<dataResponse> {
        const options: options = { where: { selector, value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Description: description, auth?:string): Promise<dataResponse> {
        const {brand, color, dimensions, other, product_id} = Description;

        const user_id = await this.getUserId({productId:product_id});

        
        if(auth && await jwtCtrl.checkToken(auth, {id:user_id, type:this.type})){
            if (brand|| color|| dimensions|| other|| product_id)
                return await db.insert(descriptionData(Description), {
                    toValidate: { selector: 'product_id' },
                });
            else return errors.requestEmpty;
        }
        return errors.notAuth;
    }

    async update(id: number, Description: description, auth?:string): Promise<dataResponse> {
        if(Description.id || Description.product_id)  return errors.idCannotChange;
        const {brand, color, dimensions, other} = Description;
        const user_id = await this.getUserId({descId:id});

        if(auth && await jwtCtrl.checkToken(auth, {id:user_id, type:this.type})){
            if (brand|| color|| dimensions|| other)
                return await db.update(descriptionData(Description), {
                    selector: 'id',
                    value: id,
                });
            else return errors.requestEmpty;
        }
        return errors.notAuth;
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        if(auth && await jwtCtrl.checkToken(auth, {id:await this.getUserId({descId:id})}))
            return await db.delete({ selector: 'id', value: id });
        return errors.notAuth;
    }

    private async getUserId(data:{productId?:number, descId?:number}):Promise<number>{
        const {descId, productId} = data;
        let id:number|undefined = productId;
            
        if(descId !== undefined){
            const req = await this.get(id);
            const {product_id} = (<description>req.data);
            id = product_id;
        }

        if(!id) throw new Error('Id is undifined');

        const req = await productCtrl.get(id);
        const {seller_id} = req.data;

        const reqSeller = await sellerCtrl.get(seller_id);
        const {user_id} = reqSeller.data;
        return user_id;       
    }
    
}

export default DescriptionsController;
