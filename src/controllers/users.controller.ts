import dbConfig from '../db.config';
import Database, { dataResponse, options, queryParam } from '../database';
import { decrypt, encrypt } from '../function/encrypt';
import Errors from '../database/messages/errors';
import Messages from '../database/messages/';
import JwtController from './Jwt.controller';

interface user {
  id?: number;
  names?: string;
  last_names?: string;
  email?: string;
  password?: string;
  sex?: number;
  direction?: string | undefined;
  cart?: string;
  birthday?: Date;
  type?: number;
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
        { selector: 'names', value: convertIntoLowerCase(user.names) },
        { selector: 'last_names', value: convertIntoLowerCase(user.last_names) },
        { selector: 'email', value: convertIntoLowerCase(user.email) },
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

const convertIntoLowerCase = (str?:string|null):string | null | undefined =>  {
    if(str && typeof str === 'string') return str.toLowerCase();
    return str;
};

const convertIntoJson = function (string?: string) {
    if (string) return JSON.parse(JSON.stringify(string));
    return undefined;
    
};

const pdwCtrl = function (Pwd: string | undefined, Encrypt: boolean, usePwd: boolean) {
    if (usePwd === true && Pwd) return Encrypt ? encrypt(Pwd) : Pwd;
    return undefined;    
};

class UsersController {
    async get(
        auth?: string,
        id: number | undefined = undefined,
        getPublic = false
    ): Promise<dataResponse> {
        if (!auth || !(await jwtCtrl.checkToken(auth))) return errors.notAuth;
        const userId = jwtCtrl.getTokenData(auth).data?.id;
        if (!userId) return errors.allNeeded;
        if (!getPublic) id = userId;
        const options: options = { where: { selector: 'id', value: id } };
        const resp = await dataBase.select(
            'id, names, last_names, email, sex, direction, cart, birthday, type, created_date',
            id ? options : null
        );

        if (id) {
            if (!auth || !(await jwtCtrl.checkToken(auth, { id, type: 2 })))
                return errors.notAuth;
            return resp;
        }
        if (!auth || !(await jwtCtrl.checkToken(auth, { type: 2 })))
            return errors.notAuth;
        return resp;
    }

    async post(User: user): Promise<dataResponse> {
        const { email, last_names, names, password, type } = User;

        const userValidate =
      email && last_names && names && password && type !== undefined;
        if (!userValidate) return errors.allNeeded;
        return await dataBase.insert(userData(User, { sndEncrypt: true }), {
            toValidate: { selector: 'email' },
        });
    }

    async putOrPatch(
        id: number,
        User: user,
        auth?: string
    ): Promise<dataResponse> {
        if (User.id) return errors.idCannotChange;
        const newData: queryParam = userData(User, { usePwd: false });
        const { birthday, email, last_names, names, sex, type, cart } = User;
        const userValidator =
      birthday ||
      email ||
      last_names ||
      names ||
      cart ||
      sex !== undefined ||
      type !== undefined;

        if (!auth || !(await jwtCtrl.checkToken(auth, { id, type:2})))
            return errors.notAuth;
        if (!userValidator) return errors.requestEmpty;

        return await dataBase.update(
            newData,
            { selector: 'id', value: id },
            { toValidate: { selector: 'email' } }
        );
    }

    async delete(id: number, auth?: string): Promise<dataResponse> {
        if (auth && (await jwtCtrl.checkToken(auth, { id })))
            return await dataBase.delete({ selector: 'id', value: id });
        else return errors.notAuth;
    }

    async ChangePwd(
        id: number,
        req: changePassword,
        auth?: string
    ): Promise<dataResponse> {
        const { new_pwd, old_pwd } = req;
        if (!auth || !(await jwtCtrl.checkToken(auth, { id })))
            return errors.notAuth;
        if (!new_pwd && !old_pwd) return errors.allNeeded;

        const getPwd = await dataBase.select('password', {
            where: { selector: 'id', value: id },
        });

        const getedOldPwd = getPwd.data.password;

        if (!getedOldPwd) return messages.create(404, 'user not found');
        if (!decrypt(old_pwd, getedOldPwd)) return errors.passwordNotMatch;

        if (new_pwd !== old_pwd)
            await dataBase.update(
                { selector: 'password', value: encrypt(new_pwd) },
                { selector: 'id', value: id }
            );
        return messages.create(200, 'password changed');
    }

    async Login(loginData: login): Promise<dataResponse> {
        const { email, password } = loginData;
        if (!email && !password) return errors.allNeeded;

        const options: options = { where: { selector: 'email', value: email } };
        const userData = await dataBase.select('password, id, email', options);
        const { id } = userData.data;
        const toCheckPassword = userData.data.password;

        if (!id && !toCheckPassword) return errors.pwdOrEmailNoValid;

        if (!decrypt(password, toCheckPassword)) return errors.pwdOrEmailNoValid;

        return jwtCtrl.token({ id, email });
    }
}

export default UsersController;
export { user };
