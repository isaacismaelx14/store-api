/* eslint-disable @typescript-eslint/no-explicit-any */

import DataBaseController from './controllers/database.controller';
import { dataResponse,options,data } from './plugins/db.interfaces';
import { queryParam, queryParams,config } from './plugins/db.types';
//Class database
class Database extends DataBaseController {
    constructor(table: string, config: config, isDev = false) {
        super(table, config, isDev);
    }

    async select(
        selection = '*',
        options: options | null = null
    ): Promise<dataResponse> {
        try {
            const response = await this.queryLogic('SELECT', {
                selection,
                options,
            });
            return response;
        } catch (error) {
            return this.errors.create(400, error);
        }
    }

    async insert(
        values: queryParam,
        options: options | null = null
    ): Promise<dataResponse> {
        try{
            const data: data = { options, values };
            const response = await this.queryLogic('INSERT', data);
            return response;
        }catch (error) {
            return this.errors.create(400, error);
        }
    }

    async delete(where: queryParam): Promise<dataResponse> {
        try{
            const data: data = { options: { where } };
            const response = await this.queryLogic('DELETE', data);
            return response;
        }catch (error) {
            return this.errors.create(400, error);
        }
    }

    async update(
        set: queryParam,
        where: queryParams,
        options: options | null = null
    ): Promise<dataResponse> {
        try{
            const data: data = {
                options: { set, where, toValidate: options?.toValidate },
                values: set,
            };
            const response = await this.queryLogic('UPDATE', data);
            return response;
        }catch (error) {
            return this.errors.create(400, error);
        }
    }
}

export default Database;
export {dataResponse, options, queryParam, config};
