import bcrypt from 'bcrypt';

function encrypt(pwd:string):string {
  const encrypted:string = bcrypt.hashSync(pwd, 1029);
  return encrypted;
}

function decrypt(pwd:string, pwdEncrypt:string):boolean{
  return bcrypt.compareSync(pwd, pwdEncrypt);
}

export {encrypt, decrypt};