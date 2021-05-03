import Messages from '.';
import { dataResponse } from '../';


class Errors extends Messages {
  
    get allNeeded(): dataResponse {
        return this.create(400, 'You forgot some values');
    }

    get requestEmpty(): dataResponse {
        return this.create(400, 'the body request do not contain any valid value');
    }
    
    get pwdOrEmailNoValid():dataResponse{
        return this.create(401, 'password or email is not valid');
    }
    
    get passwordNotMatch():dataResponse{
        return this.create(400, 'Passwords do not match');
    }

    get unknowError() :dataResponse{
        return this.create(404, 'error was happened');
    }

    get notAuth():dataResponse{
        return this.create(401, 'You do not have the permissions necesary');
    }

    get idCannotChange():dataResponse{
        return this.create(401, 'You cannot change the id');
    }
}


export default Errors;
