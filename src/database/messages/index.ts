import { CodeResponse } from '../plugins/db.types';
import { dataResponse } from '../';

class Messages {
    create(code:CodeResponse, message:string):dataResponse{
        return {code, data:{message}};
    }
}

export default Messages;