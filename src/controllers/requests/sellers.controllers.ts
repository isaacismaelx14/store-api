import UsersController from '../../controllers/users.controller';
import SellersController from '../../controllers/sellers.controller';
import Database, { dataResponse, queryParam } from '../../database';
import Errors from '../../database/messages/errors';
import { dbRequestConfig } from '../../db.config';
import JwtController from '../Jwt.controller';

const db = new Database('sellers', dbRequestConfig);
const jwtCtrl = new JwtController();
const errors = new Errors();

interface ISeller {
  id?: number;
  user_id?: number;
  name?: string;
  description?: string;
  direction?: string;
  state?: string;
  admin_message?: string;
  created_date?: Date;
}

export class SellerReqController {
    private sellerController = new SellersController();
    private userController = new UsersController();
  private sellerData = (Seller: ISeller): queryParam => [
      { selector: 'user_id', value: Seller.user_id },
      { selector: 'name', value: this.toLowerCase(Seller.name) },
      { selector: 'description', value: Seller.description },
      { selector: 'direction', value: Seller.direction },
      { selector: 'state', value: Seller.state },
      { selector: 'admin_message', value: Seller.admin_message },
  ];

  private toLowerCase(str?: string) {
      if (str) return str.toLocaleLowerCase();
      return undefined;
  }

  async post(Seller: ISeller, auth?: string): Promise<dataResponse> {
      console.log(Seller);
      const { description, name } = Seller;

      if (!auth || !(await jwtCtrl.checkToken(auth))) return errors.notAuth;
      const userId = jwtCtrl.getTokenData(auth).data?.id;

      if (!userId) return errors.allNeeded;
      Seller.user_id = userId;

      if (!description || !name) return errors.allNeeded;

      return await db.insert(this.sellerData(Seller));
      // return errors.create(200, 's'); //for tests
  }

  async getAll(auth?: string): Promise<dataResponse> {
      if (!auth || !(await jwtCtrl.checkToken(auth, { type: 2 })))
          return errors.notAuth;
      return await db.select();
  }

  async getById(id: number, auth?: string): Promise<dataResponse> {
      if (!auth || !(await jwtCtrl.checkToken(auth, { type: 2 })))
          return errors.notAuth;
      return await db.select('*', { where: { selector: 'id', value: id } });
  }

  async accetRequest(getterId: number, auth?: string): Promise<dataResponse> {
      if (!auth || !(await jwtCtrl.checkToken(auth, { type: 2 })))
          return errors.notAuth;
      const {data: {id, user_id, name, description, direction}} = await db.select('*', { where: { selector: 'id', value: getterId } });
      const {data:{type}} = await this.userController.get(auth, user_id, true);
      await this.sellerController.post({user_id, name, description, direction}, auth);
      if(type < 1) await this.userController.putOrPatch(user_id, {type:1}, auth);
      await db.delete({ selector: 'id', value: id });
      return errors.create(200, 'created');     
  }

  async putOrPatch(
      id: number,
      Seller: ISeller,
      auth?: string
  ): Promise<dataResponse> {
      if (Seller.id) return errors.idCannotChange;
      const newData: queryParam = this.sellerData(Seller);
      const { description, direction, name, admin_message, state } = Seller;
      const sellerValidator =
      description || direction || name || admin_message || state;

      if (!auth || !(await jwtCtrl.checkToken(auth, { type: 2 })))
          return errors.notAuth;
      if (!sellerValidator) return errors.requestEmpty;

      return await db.update(newData, { selector: 'id', value: id });
  }
}
