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
        // console.log(userType >= type);
        if(userType >= type)
            return true;
        return false;
    }

    getTokenData(auth:string):{exist:boolean, data?:tokenRes}{
        const token:string = this.convertToken(auth);

        if(process.env.TOKEN_SECRET){
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const typedToken = (<tokenRes>decodedToken);
            if(!token || !typedToken)
                return {exist:false};
            return {exist:true, data:typedToken};
        }
        return {exist:false};
    }

    private convertToken(auth:string):string{
        if(auth && auth.toLowerCase().startsWith('bearer')){
            return auth.substring(7); 
        }   
        // throw new Error('It is imposible to get the token:The Token Do not have the correct');
        return '';
    }

    async verifyData(data:{ id?:number, type?:number}, typedToken:tokenRes):Promise<boolean>{
        const{id,type}=data;
        let state = true;

        const idCheck = id !== undefined && typedToken.id !== id;
        const typeCheck = type && !(await this.getTypeAuth(typedToken.id, type));

        if (idCheck) state=false;
        if(typeCheck) state=false;

        if(id && type){
            state = true;
            if(idCheck && typeCheck) state = false;       
        }

        return !state;
    }

    async checkToken(auth:string,data?:{ id?:number, type?:number}):Promise<boolean>{
        const deft:{ id?:number, type?:number} = {id:undefined, type:undefined};
        const token:string = this.convertToken(auth);
        
        if(!data) data = deft;
    
        if(token && process.env.TOKEN_SECRET)
            try{
                const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
                const typedToken = (<tokenRes>decodedToken);

                if(await this.verifyData(data, typedToken)) return false;

                if(!token || !typedToken){
                    return false;
                }else{             
                    return true;
                }  
                
            }catch(e){
                console.log(e);
                return false;
            }
        
        return false;
    }

    token(data:tokenRes):dataResponse {
        if(process.env.TOKEN_SECRET){
            const token= jwt.sign(data, process.env.TOKEN_SECRET);
            return {code:200, data:{token}};
        }else{
            return this.messages.create(400, 'it\'s imposible to create the token Contact with the backend admin. -> Unhanddle: TOKEN_SECRET <-');
        } 
    }
}

export default JwtController;
export {tokenRes};
