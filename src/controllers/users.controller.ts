import dbConfig from '../db.config';
import Database, { dataResponse, options, queryParam } from '../database';
import { decrypt, encrypt } from '../function/encrypt';
import Errors from '../database/messages/errors';
import Messages from '../database/messages/';
import JwtController from './Jwt.controller';

interface user {
  id?: number;
  names: string;
  last_names: string;
  email: string;
  password: string;
  sex: number;
  direction: string | undefined;
  cart: string;
  birthday: Date;
  type: number;
  created_at?: Date;
}

interface changePassword {
  new_pwd: string;
  old_pwd: string;
}

interface login {
  email: string;
  password: string;
}

const dataBase = new Database('users', dbConfig);
const errors = new Errors();
const messages = new Messages();
const jwtCtrl = new JwtController();

const userData = (
    user: user,
    opt?: { sndEncrypt?: boolean; usePwd?: boolean }
): queryParam => {
    if (!opt) opt = {};
    if (!opt.usePwd) opt.usePwd = true;
    if (!opt.sndEncrypt) opt.sndEncrypt = true;
    return [
        { selector: 'names', value: user.names.toLocaleLowerCase() },
        { selector: 'last_names', value: user.last_names.toLocaleLowerCase() },
        { selector: 'email', value: user.email.toLocaleLowerCase() },
        {
            selector: 'password',
            value: pdwCtrl(user.password, opt.sndEncrypt, opt.usePwd),
        },
        { selector: 'sex', value: user.sex },
        { selector: 'direction', value: user.direction },
        { selector: 'birthday', value: user.birthday },
        { selector: 'cart', value: convertIntoJson(user.cart) },
        { selector: 'type', value: user.type },
    ];
};

const convertIntoJson = function (string: string) {
    if (string) {
        return JSON.parse(JSON.stringify(string));
    } else {
        return undefined;
    }
};

const pdwCtrl = function (Pwd: string, Encrypt: boolean, usePwd: boolean) {
    if (usePwd === true) {
        return Encrypt ? encrypt(Pwd) : Pwd;
    } else {
        return undefined;
    }
};

class UsersController {
    async get(id: number | undefined = undefined): Promise<dataResponse> {
        const options: options = { where: { selector: 'id', value: id } };
        try {
            return await dataBase.select(
                'id, names, last_names, email, sex, direction, cart, birthday, type, created_date',
                id ? options : null
            );
        } catch (error) {
            return errors.create(400, error);
        }
    }

    async post(User: user): Promise<dataResponse> {
        const { birthday, email, last_names, names, password, sex, type } = User;
        try {
            const userValidate =
        birthday &&
        email &&
        last_names &&
        names &&
        password &&
        sex !== undefined &&
        type !== undefined;
            if (userValidate)
                return await dataBase.insert(userData(User, { sndEncrypt: true }), {
                    toValidate: { selector: 'email' },
                });
            else return errors.allNeeded;
        } catch (error) {
            return errors.create(400, error);
        }
    }

    async putOrPatch(
        id: number,
        User: user,
        auth?: string
    ): Promise<dataResponse> {
        if(User.id) return errors.idCannotChange;
        try {
            const newData: queryParam = userData(User, { usePwd: false });
            const { birthday, email, last_names, names, sex, type } = User;
            const userValidator =
            birthday ||
            email ||
            last_names ||
            names ||
            sex !== undefined ||
            type !== undefined;

            if (auth && await jwtCtrl.checkToken(auth, {id})) {
                if (userValidator)
                    return await dataBase.update(
                        newData,
                        { selector: 'id', value: id },
                        { toValidate: { selector: 'email' } }
                    );
                else return errors.requestEmpty;
            } else {
                return errors.notAuth;
            }
        } catch (error) {
            return errors.create(400, error);
        }
    }

    async delete(id: number, auth?:string): Promise<dataResponse> {
        try {
            if(auth && await jwtCtrl.checkToken(auth, {id}))
                return await dataBase.delete({ selector: 'id', value: id });
            else return errors.notAuth;
            
        } catch (error) {
            return errors.create(400, error);
        }
    }

    async ChangePwd(
        id: number,
        req: changePassword,
        auth?: string
    ): Promise<dataResponse> {
        const { new_pwd, old_pwd } = req;
        if (auth && await jwtCtrl.checkToken(auth, {id})) {
            if (!new_pwd && !old_pwd)  return errors.allNeeded;

            const getPwd = await dataBase.select('password', {
                where: { selector: 'id', value: id },
            });

            const getedOldPwd = getPwd.data.password;

            if (!getedOldPwd) return messages.create(404, 'user not found');
            if (!decrypt(old_pwd, getedOldPwd)) return errors.passwordNotMatch;

            if (new_pwd !== old_pwd)
                try {
                    await dataBase.update(
                        { selector: 'password', value: encrypt(new_pwd) },
                        { selector: 'id', value: id }
                    );
                } catch (error) {
                    return errors.create(400, error);
                }
            return messages.create(200, 'password changed');        
        }
        return errors.notAuth;
    }

    async Login(loginData: login): Promise<dataResponse> {
        const { email, password } = loginData;
        if (!email && !password) return errors.allNeeded;

        try {
            const options: options = { where: { selector: 'email', value: email } };
            const userData = await dataBase.select('password, id, email', options);
            const { id} = userData.data;
            const toCheckPassword = userData.data.password;

            if (!id && !toCheckPassword)  return errors.pwdOrEmailNoValid;

            if (!decrypt(password, toCheckPassword)) return errors.pwdOrEmailNoValid;
            
            return jwtCtrl.token({id, email});    
            
        } catch (error) {
            return errors.create(400, error);
        }
      
    }
}

export default UsersController;
export { user };
