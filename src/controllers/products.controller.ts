import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../errors';

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

    async post(Products: Products): Promise<dataResponse> {
        const {
            about,
            category_id,
            picture_id,
            price,
            seller_id,
            stock,
            title,
        } = Products;

        if (about && category_id && picture_id && price && seller_id && stock > 0 && title)
            return await db.insert(productsData(Products));
        else return errors.allNeeded;
    }

    async patch(id: number, Products: Products): Promise<dataResponse> {
        const {
            about,
            category_id,
            picture_id,
            price,
            seller_id,
            stock,
            title,
        } = Products;

        if (about || category_id || picture_id || price || seller_id || stock  !== undefined || title)
            return await db.update(productsData(Products), {
                selector: 'id',
                value: id,
            });
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default ProductsController;
