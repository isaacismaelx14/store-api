/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryParam, validator, dataOptions, CodeResponse } from './db.types';

interface dataResponse {
    code: CodeResponse;
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