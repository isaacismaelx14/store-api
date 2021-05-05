import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import SellerController from '../controllers/sellers.controller';
import JwtController from './Jwt.controller';

interface Products {
  id?: number;
  picture_id: number;
  seller_id: number;
  category_id: number;
  title: string;
  price: DoubleRange;
  stock: number;
  about: string;
  tags: string;
  created_date?: Date;
}

const db = new Database('products', dbConfig);
const errors = new Errors();
const sellerCtrl = new SellerController();
const jwtCtrl = new JwtController();

const productsData = (Products: Products): queryParam => [
    { selector: 'about', value: Products.about },
    { selector: 'category_id', value: Products.category_id },
    { selector: 'picture_id', value: Products.picture_id },
    { selector: 'price', value: Products.price },
    { selector: 'seller_id', value: Products.seller_id },
    { selector: 'stock', value: Products.stock },
    { selector: 'tags', value: Products.tags },
    { selector: 'title', value: Products.title },
];

class ProductsController {
    async get(id: number | undefined = undefined): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Products: Products, auth?:string): Promise<dataResponse> {
        const {
            about,
            category_id,
            picture_id,
            price,
            seller_id,
            stock,
            title,
        } = Products;

        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getUserId({sellerId:seller_id})}))) return errors.notAuth;
        if (!about || !category_id || !picture_id || !price || !seller_id || stock === 0 || !title) return errors.allNeeded;
        return await db.insert(productsData(Products));       
    }

    async patch(id: number, Products: Products, auth?:string): Promise<dataResponse> {
        if(Products.id || Products.seller_id) return errors.idCannotChange;
        const {
            about,
            category_id,
            picture_id,
            price,
            stock,
            title,
        } = Products;
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getUserId({productId:id})}))) return errors.notAuth;
        if (!about && !category_id && !picture_id && !price && stock  === undefined || title)  return errors.requestEmpty;

        return await db.update(productsData(Products), {
            selector: 'id',
            value: id,
        });
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        console.log(id);
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getUserId({productId:id})})))
            return errors.notAuth;
        return await db.delete({ selector: 'id', value: id });
        // return {code:201, data:{m:'s'}}; //fot tests
    }

    
    private async getUserId(data:{sellerId?:number, productId?:number}):Promise<number>{
        const {productId, sellerId} = data;
        let id:number|undefined;
        
        if(sellerId) id = sellerId;
        
        if(productId !== undefined){
            const req = await this.get(id);
            id = await req.data[0].seller_id;
            console.log(id);
        }
        
        if(!id) throw new Error('Id is undifined');
        
        const reqSeller = await sellerCtrl.get(id);
        const {user_id} = reqSeller.data;
        return user_id;       
    }
}

export default ProductsController;
