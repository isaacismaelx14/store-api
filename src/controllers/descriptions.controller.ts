import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';

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

const descriptionData = (Description: description): queryParam => [
    { selector: 'product_id', value: Description.product_id },
    { selector: 'color', value: Description.color },
    { selector: 'dimensions', value: Description.dimensions },
    { selector: 'brand', value: Description.brand },
    { selector: 'weigth', value: Description.weigth },
    { selector: 'other', value: Description.other },
];

class DescriptionsController {
    async get(id?: number, selector = 'id'): Promise<dataResponse> {
        const options: options = { where: { selector, value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Description: description): Promise<dataResponse> {
        const {brand, color, dimensions, other, product_id} = Description;
        if (brand|| color|| dimensions|| other|| product_id)
            return await db.insert(descriptionData(Description), {
                toValidate: { selector: 'product_id' },
            });
        else return errors.requestEmpty;
    }

    async update(id: number, Description: description): Promise<dataResponse> {
        if(Description.id || Description.product_id)  return errors.idCannotChange;
        const {brand, color, dimensions, other} = Description;
        if (brand|| color|| dimensions|| other)
            return await db.update(descriptionData(Description), {
                selector: 'id',
                value: id,
            });
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default DescriptionsController;
