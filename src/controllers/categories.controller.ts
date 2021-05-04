import DataBase, { dataResponse, options, queryParam } from '../database';
import Errors from '../database/messages/errors';
import dbConfig from '../db.config';
import JwtController from './Jwt.controller';

interface category {
  id?: number;
  category: string;
}

const db = new DataBase('categories', dbConfig);
const errors = new Errors();
const jwtCtrl = new JwtController();

const mainSelector = 'category';

const categoryData = (Category: category): queryParam => [
    { selector: mainSelector, value: Category.category.toLocaleLowerCase() },
];

class CategoriesController {
    private userType = 2;

    async get(id?: number): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Category: category, auth?:string): Promise<dataResponse> {
        if(auth && await jwtCtrl.checkToken(auth, {type:this.userType})){
            const { category } = Category;
            if (category)
                return await db.insert(categoryData(Category), {
                    toValidate: { selector: mainSelector },
                });
            else return errors.allNeeded;
        }

        return errors.notAuth;
    }

    async update(id: number, Category: category, auth?:string): Promise<dataResponse> {
        if(Category.id) return errors.idCannotChange;
        
        if(auth && await jwtCtrl.checkToken(auth, {type:this.userType})){
            return await db.update(
                categoryData(Category),
                { selector: 'id', value: id },
                { toValidate: { selector: mainSelector } }
            );
        }
        return errors.notAuth;
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        if(auth && await jwtCtrl.checkToken(auth, {type:this.userType})){
            // return await db.delete({ selector: 'id', value: id });
            return {code:200, data:{message:'hey'}};
        }
        return errors.notAuth;
    }
}

export default CategoriesController;
