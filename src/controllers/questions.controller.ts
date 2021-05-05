import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JwtController from './Jwt.controller';

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
        const {product_id, question} = Question;
        
        if(!auth || !(await jwtCtrl.checkToken(auth))) return errors.notAuth;
        const userId = jwtCtrl.getTokenData(auth).data?.id;
        if(!userId) return errors.notAuth;
        Question.user_id = userId;
        if(!product_id || !question) return errors.allNeeded;

        return await db.insert(questionData(Question));     

    }

    async update(id: number, Question: question, auth?:string): Promise<dataResponse> {
        if(Question.id || Question.product_id || Question.user_id) return errors.idCannotChange;
        const {question, star} = Question;
        
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:await this.getId(id)}))) return errors.notAuth;
        if( !question && star === undefined)  return errors.requestEmpty;
       
        return await db.update(questionData(Question), {
            selector: 'id',
            value: id,
        });    

    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        const getterId = await this.getId(id) ;

        if(getterId === 0) return errors.valueNotExist('id',id);

        if(!auth ||  !(await jwtCtrl.checkToken(auth, {id:getterId}))) return errors.notAuth;

        return await db.delete({ selector: 'id', value: id });

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
