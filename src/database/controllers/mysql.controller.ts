import { Connection, ConnectionConfig, createConnection } from 'mysql';

class MysqlController{
    private __CONN:Connection;

    constructor(conn:ConnectionConfig){
        this.__CONN = createConnection(conn);
    }
    connect():Promise<unknown>{
        return new Promise((resolve, reject) => {
            this.__CONN.connect((err, args) => {
                if(err) reject(err);
                resolve(args);
            });
        });
    }

    async test():Promise<boolean>{
        try{
            console.log(await this.connect());
            return true;
        }catch(error){
            console.log(error);
            return false;
        }
    }
}
export default MysqlController;