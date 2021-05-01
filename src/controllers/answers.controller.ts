import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';

interface answer {
  id?: number;
  parent_id: number;
  user_id: number;
  answer: string;
  created_date?: Date;
}

const db = new Database('answers', dbConfig);
const errors = new Errors();

const answerData = (Answer: answer): queryParam => [
    { selector: 'user_id', value: Answer.user_id },
    { selector: 'parent_id', value: Answer.parent_id },
    { selector: 'answer', value: Answer.answer },
];

class AnswersController {
    async get(id?: number): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Answer: answer): Promise<dataResponse> {
        const { answer, parent_id, user_id } = Answer;
        if (parent_id && user_id && answer) return db.insert(answerData(Answer));
        else return errors.allNeeded;
    }

    async update(id: number, Answer: answer): Promise<dataResponse> {
        const { answer, parent_id, user_id } = Answer;
        if (answer || parent_id || user_id) return db.update(answerData(Answer), { selector: 'id', value: id });
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return db.delete({ selector: 'id', value: id });
    }
}

export default AnswersController;
