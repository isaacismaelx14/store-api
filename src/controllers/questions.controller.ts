import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JwtController from '../function/jws';

interface question {
  id?: number;
  product_id: number;
  user_id: number;
  question: string;
  star: number;
  created_date?: number;
}

const db = new Database('questions', dbConfig);
const errors = new Errors();
const jwtCtrl = new JwtController();

const questionData = (Question: question): queryParam => [
    { selector: 'product_id', value: Question.product_id },
    { selector: 'user_id', value: Question.user_id },
    { selector: 'question', value: Question.question },
    { selector: 'star', value: Question.star },
];

class QuestionController {
    async get(id?: number, selector = 'id'): Promise<dataResponse> {
        const options: options = { where: { selector, value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Question: question, auth?:string): Promise<dataResponse> {
        const {product_id, question, user_id} = Question;
        
        if(auth && await jwtCtrl.checkToken(auth, {id:user_id})){
            if(product_id && question && user_id)
                return await db.insert(questionData(Question));
            else return errors.allNeeded;
        }
        return errors.notAuth;
    }

    async update(id: number, Question: question, auth?:string): Promise<dataResponse> {
        if(Question.id || Question.product_id || Question.user_id) return errors.idCannotChange;
        
        const {question, star} = Question;
        if(auth && await jwtCtrl.checkToken(auth, {id:await this.getId(id)})){
            if( question || star !== undefined)
                return await db.update(questionData(Question), {
                    selector: 'id',
                    value: id,
                });
            else return errors.requestEmpty;
        }
        return errors.notAuth;
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        const getterId = await this.getId(id) ;

        if(getterId === 0) return errors.valueNotExist('id',id);

        if(auth &&  await jwtCtrl.checkToken(auth, {id:getterId}))
            return await db.delete({ selector: 'id', value: id });
        // return {code:200, data:{m:'testing', id:await this.getId(id)}}; //Test
        return errors.notAuth;
    }

    async getId(questionId:number):Promise<number>{
        const req = await this.get(questionId);
        console.log(req);
        const {user_id} = req.data;
        if(!user_id) return 0;
        return user_id;
    }
}

export default QuestionController;
