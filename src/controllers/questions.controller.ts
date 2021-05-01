import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
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

    async post(Question: question): Promise<dataResponse> {
        const {product_id, question, user_id} = Question;
        console.log(Question);
        if(product_id && question && user_id)
            return await db.insert(questionData(Question));
        else return errors.allNeeded;
    }

    async update(id: number, Question: question): Promise<dataResponse> {
        const {product_id, question, user_id, star} = Question;
        if(product_id || question || user_id || star !== undefined)
            return await db.update(questionData(Question), {
                selector: 'id',
                value: id,
            });
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default QuestionController;
