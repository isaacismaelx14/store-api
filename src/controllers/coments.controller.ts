import Database, { dataResponse, options, queryParam } from '../database';
import dbConfig from '../db.config';
import Errors from '../errors';

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

    async post(Comment: comment): Promise<dataResponse> {
        const {comment, product_id, user_id} = Comment;
        if(comment && product_id && user_id)
            return await db.insert(commentData(Comment));
        else 
            return errors.requestEmpty;
    }

    async update(id: number, Comment: comment): Promise<dataResponse> {
        const {comment, product_id, user_id, star} = Comment;
        if(comment || product_id || user_id || star !== undefined)
            return await db.update(commentData(Comment), { selector: 'id', value: id });
        else return errors.allNeeded;
    }

    async delete(id: number): Promise<dataResponse> {
        return await db.delete({ selector: 'id', value: id });
    }
}

export default CommentsController;
