import { dataResponse } from 'database';
import Messages from '../database/messages';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


interface tokenRes{
    id: number,
    email: string
}


class JwtController {

    private messages:Messages;

    constructor(){
        this.messages = new Messages();
        dotenv.config();
    }

    checkToken(auth:string, id:number):boolean{
        
        let token:string|null = null;

        if(auth && auth.toLowerCase().startsWith('bearer')){
            token = auth.substring(7); 
        }
        if(token && process.env.TOKEN_SECRET){
            try{
                const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
                const typedToken = (<tokenRes>decodedToken);
                if(typedToken.id !== id) return false;
                if(!token || !typedToken){
                    return false;
                }else{
                    return true;
                }  
            }catch{
                return false;
            }
        }
        return false;
    }

    token(id:number, email:string):dataResponse {
        if(process.env.TOKEN_SECRET){
            const token= jwt.sign({ id, email }, process.env.TOKEN_SECRET);
            return {code:200, data:{token}};
        }else{
            return this.messages.create(400, 'it\'s imposible to create the token');
        } 
    }
}

export default JwtController;
