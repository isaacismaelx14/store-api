import { dataResponse } from 'database';
import Messages from '../database/messages';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import DataBase from '../database';      //Maybe you can do some db conections
import dbConfig from '../db.config';

interface tokenRes{
    id: number,
    email: string
}


class JwtController {

    private messages:Messages;
    private db:DataBase;

    constructor(){
        this.messages = new Messages();
        this.db = new DataBase('users', dbConfig);
        dotenv.config();
    }

    private async getTypeAuth(id:number, type:number):Promise<boolean> {
        const consult = await this.db.select('type', {where:{selector:'id', value:id}});
        const userType = await consult.data.type;
        if(type === userType)
            return true;
        return false;
    }

    async checkToken(auth:string,data:{ id?:number, type?:number}):Promise<boolean>{
        
        const {id, type} = data;
        
        let token:string|null = null;
        
        if(auth && auth.toLowerCase().startsWith('bearer')){
            token = auth.substring(7); 
        }
        if(token && process.env.TOKEN_SECRET){
            try{
                const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
                const typedToken = (<tokenRes>decodedToken);
                if(id !== undefined && typedToken.id !== id) return false;
                if(type && !(await this.getTypeAuth(typedToken.id, type))) return false;

                if(!token || !typedToken){
                    return false;
                }else{             
                    return true;
                }  
                
            }catch(e){
                console.log(e);
                return false;
            }
        }
        return false;
    }

   

    token(data:tokenRes):dataResponse {
        if(process.env.TOKEN_SECRET){
            const token= jwt.sign(data, process.env.TOKEN_SECRET);
            return {code:200, data:{token}};
        }else{
            return this.messages.create(400, 'it\'s imposible to create the token');
        } 
    }
}

export default JwtController;
