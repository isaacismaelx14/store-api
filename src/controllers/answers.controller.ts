import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JwtController from './Jwt.controller';

interface answer {
  id?: number;
  parent_id: number;
  user_id: number;
  answer: string;
  created_date?: Date;
}

const db = new Database('answers', dbConfig);
const errors = new Errors();
const jwtCtrl = new JwtController();

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

    async post(Answer: answer, auth?: string): Promise<dataResponse> {
        const { answer, parent_id } = Answer;
        if (!auth || !(await jwtCtrl.checkToken(auth)) ) return errors.notAuth;
        const userId = jwtCtrl.getTokenData(auth).data?.id;
        if(!userId) return errors.notAuth;
        if (!parent_id || !answer) return errors.allNeeded;
        Answer.user_id = userId;
        
        return db.insert(answerData(Answer));  
    }

    async update(
        id: number,
        Answer: answer,
        auth?: string
    ): Promise<dataResponse> {
        const check = await this.get(id);
        const { user_id } = check.data;
        const { answer, parent_id} = Answer;
        
        if(Answer.user_id || Answer.id) return errors.idCannotChange; 
        if (!auth || !(await jwtCtrl.checkToken(auth, {id:user_id}))) return errors.notAuth;
        if (!answer && !parent_id)return errors.requestEmpty;
        
        Answer.user_id = user_id;
        return db.update(answerData(Answer), { selector: 'id', value: id }); 
    }

    async delete(id: number, auth?: string): Promise<dataResponse> {
        const check = await this.get(id);
        const { user_id } = check.data;
        if (!auth || !(await jwtCtrl.checkToken(auth, {id:user_id}))) return errors.notAuth;
        return db.delete({ selector: 'id', value: id });
    }
}

export default AnswersController;
