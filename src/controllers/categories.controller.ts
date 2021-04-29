import DataBase, { dataResponse, options, queryParam } from '../database';
import Errors from '../errors';
import dbConfig from '../db.config';

interface category {
  id?: number;
  category: string;
}

const db = new DataBase('categories', dbConfig);
const errors = new Errors();
const mainSelector = 'category';

const categoryData = (Category: category): queryParam => [
    { selector: mainSelector, value: Category.category.toLocaleLowerCase() },
];

class CategoriesController {
    async get(id?: number): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Category: category): Promise<dataResponse> {
        const { category } = Category;
        if (category)
            return await db.insert(categoryData(Category), {
                toValidate: { selector: mainSelector },
            });
        else return errors.allNeeded;
    }

    async update(id: number, Category: category): Promise<dataResponse> {
        return await db.update(
            categoryData(Category),
            { selector: 'id', value: id },
            { toValidate: { selector: mainSelector } }
        );
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default CategoriesController;
