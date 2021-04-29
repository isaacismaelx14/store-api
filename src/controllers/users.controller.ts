import dbConfig from '../db.config';
import Database, { dataResponse, options, queryParam } from '../database';
import { decrypt, encrypt } from '../function/encrypt';
import Errors from '../errors';

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
        return await dataBase.select(
            'id, names, last_names, email, sex, direction, cart, birthday, type, created_date',
            id ? options : null
        );
    }

    async post(User: user): Promise<dataResponse> {
        const { birthday, email, last_names, names, password, sex, type } = User;
        if (birthday && email && last_names && names && password && sex !== undefined && type !== undefined)
            return await dataBase.insert(userData(User, { sndEncrypt: true }), {
                toValidate: { selector: 'email' },
            });
        else return errors.allNeeded;
    }

    async putOrPatch(id: number, User: user): Promise<dataResponse> {
        const newData: queryParam = userData(User, { usePwd: false });
        const { birthday, email, last_names, names, password, sex, type } = User;

        if (birthday && email && last_names && names && password && sex !== undefined && type !== undefined)
            return await dataBase.update(
                newData,
                { selector: 'id', value: id },
                { toValidate: { selector: 'email' } }
            );
        else return errors.requestEmpty;
    }

    async delete(id: number): Promise<dataResponse> {
        return await dataBase.delete({ selector: 'id', value: id });
    }

    async ChangePwd(id: number, req: changePassword): Promise<dataResponse> {
        const { new_pwd, old_pwd } = req;

        if (new_pwd && old_pwd) {
            const getPwd = await dataBase.select('password', {
                where: { selector: 'id', value: id },
            });
            const getedOldPwd = getPwd.data.password;

            if (decrypt(old_pwd, getedOldPwd)) {
                if (new_pwd !== old_pwd)
                    await dataBase.update(
                        { selector: 'password', value: encrypt(new_pwd) },
                        { selector: 'id', value: id }
                    );
                return { code: 200, data: { message: 'password changed' } };
            } else {
                return { code: 400, data: { message: 'password not match' } };
            }
        } else {
            return errors.allNeeded;
        }
    }

    async Login(loginData: login): Promise<dataResponse> {
        const { email, password } = loginData;
        if (email && password) {
            const options: options = { where: { selector: 'email', value: email } };
            const getPwdEncripted = await dataBase.select('password', options);
            if (getPwdEncripted.data) {
                const pwdEncryted = getPwdEncripted.data.password;
                if (decrypt(password, pwdEncryted))
                    return { code: 200, data: { message: true } };
                else return { code: 401, data: {} };
            } else {
                return { code: 401 };
            }
        } else {
            return errors.allNeeded;
        }
    }
}

export default UsersController;
export { user };
