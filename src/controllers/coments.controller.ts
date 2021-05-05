import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../database/messages/errors';
import JswController from './Jwt.controller';

interface comment {
  id?: number;
  product_id: number;
  user_id: number;
  comment: string;
  star: number;
  created_date?: number;
}

const db = new Database('comments', dbConfig);
const errors = new Errors();
const jwtCtrl = new JswController();

const commentData = (Comment: comment): queryParam => [
    { selector: 'product_id', value: Comment.product_id },
    { selector: 'user_id', value: Comment.user_id },
    { selector: 'comment', value: Comment.comment },
    { selector: 'star', value: Comment.star },
];

class CommentsController {
    async get(id?: number, selector = 'id'): Promise<dataResponse> {
        const options: options = { where: { selector, value: id } };
        return await db.select('*', id ? options : null);
    }

    async post(Comment: comment, auth?:string): Promise<dataResponse> {
        const {comment, product_id} = Comment;
        if(!auth || !(await jwtCtrl.checkToken(auth))) return errors.notAuth;

        const userId = jwtCtrl.getTokenData(auth).data?.id;
        if(!userId) return errors.notAuth;
        Comment.user_id = userId;
        
        if(!comment || !product_id) return errors.requestEmpty;
        return await db.insert(commentData(Comment));
    }

    async update(id: number, Comment: comment, auth?:string): Promise<dataResponse> {
        if(Comment.id || Comment.user_id) return errors.idCannotChange;
        
        const req = await this.get(id);
        const {user_id} = req.data;
        const {comment, product_id, star} = Comment;

        if(!auth || !(await jwtCtrl.checkToken(auth, {id:user_id}))) return errors.notAuth;
        if(!comment && !product_id && star === undefined) return errors.allNeeded;

        return await db.update(commentData(Comment), { selector: 'id', value: id });
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        const req = await this.get(id);
        const {user_id} = req.data;
        if(!auth || !(await jwtCtrl.checkToken(auth, {id:user_id}))) return errors.notAuth;

        return await db.delete({ selector: 'id', value: id });
    }
}

export default CommentsController;
