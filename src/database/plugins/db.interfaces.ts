/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryParam, validator, dataOptions } from './db.types';

interface dataResponse {
    code: number;
    data?: any;
  }
  
  interface options {
    where?: queryParam;
    set?: queryParam;
    toValidate?: validator;
  }
  
  interface data {
    table?: string;
    selection?: '*' | string;
    values?: queryParam;
    options?: dataOptions;
  }

export {data, dataResponse, options};