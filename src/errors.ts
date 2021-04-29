import { dataResponse } from 'database';

class Errors {
  get allNeeded(): dataResponse {
    return { code: 400, data: { message: 'You forgot some values' } };
  }

  get requestEmpty(): dataResponse {
    return {
      code: 400,
      data: { message: 'the body request do not contain any valid value' },
    };
  }
}

export default Errors;
