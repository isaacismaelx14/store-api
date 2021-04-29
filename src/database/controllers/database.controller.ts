/* eslint-disable @typescript-eslint/no-explicit-any */
import Database from '../';
import { dataResponse, options, data } from '../plugins/db.interfaces';
import {
    config,
    queryParams,
    validator,
    queryParam,
    task,
    dataOptions,
} from '../plugins/db.types';

import { Connection, createConnection } from 'mysql';

class DataBaseController {
  private isTest;
  private config: config;
  private conn: Connection;
  private table: string;

  constructor(table: string, config: config, isTest: boolean) {
      this.config = config;
      this.conn = createConnection(config);
      this.table = table;
      this.isTest = isTest;
  }

  query(query: string): Promise<unknown> {
      if (this.isTest) console.log('DevMode Active');
      return new Promise((resolve, reject) => {
          if (this.isTest === false) {
              this.conn.query(query, (error, results) => {
                  if (!error) {
                      resolve(results);
                  } else {
                      reject(error);
                      console.log('THIS IS AN ERROR', error);
                  }
              });
          } else {
              resolve(query);
              console.log('query:', query);
              console.log('finish');
          }
      });
  }

  //Get all params
  private foerEachParams(params: queryParams[], desfragmentData = false) {
      return new Promise((resolve, reject) => {
          try {
              let finaly = '';
              let pos = 0;
              let numOfUndifined = 0;
              const newParams: queryParams[] = params.filter((param) => param.value);

              const insertByPosi = function (
                  position: number,
                  array: any[],
                  insert: { front?: any; middle?: any; final?: any }
              ) {
                  const len = array.length - numOfUndifined;
                  const { front, middle, final } = insert;
                  const addMiddle = len > 1 ? (middle ? middle : '') : '';
                  let actualPosition: 'front' | 'center' | 'final' = 'front';

                  if (position === 1) actualPosition = 'front';
                  else if (position === len) actualPosition = 'final';
                  else if (position >= 0 && position < len) actualPosition = 'center';

                  if (actualPosition === 'front') return front ? front : addMiddle;
                  else if (actualPosition === 'center') return addMiddle;
                  else if (actualPosition === 'final') return final ? final : '';
              };

              const useComa = (position: number, array: any[]) => {
                  return insertByPosi(position, array, { middle: ',' });
              };

              const detectType = (value: any) => {
                  const valueType = typeof value;
                  if (valueType === 'string') {
                      if (value.includes('\'')) {
                          return `"${value}"`;
                      } else {
                          return `'${value}'`;
                      }
                  } else return value;
              };

              let selectors = '';
              let values = '';

              newParams.forEach((param) => {
                  if (param.value) {
                      pos++;
                      const value = detectType(param.value);
                      if (desfragmentData) {
                          selectors += `${param.selector}${useComa(pos, newParams)}`;
                          values += `${value}${useComa(pos, newParams)}`;
                      } else {
                          finaly += ` ${param.selector}=${value}${useComa(pos, newParams)}`;
                      }
                  } else {
                      numOfUndifined++;
                  }
              });

              if (desfragmentData) {
                  resolve({ selectors, values });
              } else {
                  resolve(finaly);
              }
          } catch (error) {
              reject(error);
              throw error;
          }
      });
  }

  private async checkIfValueExist(selector: string, value: unknown) {
      if (this.isTest === false) {
          const request = await new Database(
              this.table,
              this.config,
              this.isTest
          ).select('id', {
              where: [{ selector, value }],
          });

          const data: any[] = this.convertIntoArray(await request.data);
          console.log(data);
          
          if (data.length >= 1) {
              return true;
          }
          return false;
      } else {
          return false;
      }
  }

  //Validate if a value exist
  private async validator(
      toValidate: validator,
      values: queryParams[],
      task?: task
  ): Promise<dataResponse> {
      let getValues: any = values;
      getValues = values.filter(
          (element) => element.selector === toValidate.selector
      );

      const { selector, value } = await getValues[0];

      if (task === 'INSERT' && !value) {
          return {
              code: 400,
              data: {
                  message: `You cannot create a new data without (${value})`,
              },
          };
      }

      const checkExist = this.checkIfValueExist(selector, value);
      console.log(value , (await checkExist));
      if (value && (await checkExist))
          return {
              code: 400,
              data: { message: `This (${value}) already exist` },
          };
      else return { code: 200 };
  }

  private convertIntoArray(array: any | any[]) {
      let tempArray: any[];
      if (!Array.isArray(array)) {
          tempArray = Array(array);
      } else {
          tempArray = array;
      }
      return tempArray;
  }

  private async optionsLogic(
      options: options,
      values?: queryParam,
      task?: task
  ) {
      let response = '';
      let validate: dataResponse = { code: 200 };

      const { where, set, toValidate } = options;
      const addResponse = (fill: string) => {
          response += ` ${fill}`;
      };

      const doForEach = async (toDo: string, params: queryParam | undefined) => {
          if (params) {
              const gndResponse = `${toDo}${await this.foerEachParams(
                  this.convertIntoArray(params)
              )}`;
              addResponse(gndResponse);
          }
      };

      if (values && toValidate) {
          validate = await this.validator(
              toValidate,
              this.convertIntoArray(values),
              task
          );
      }

      await doForEach('SET', set);
      await doForEach('WHERE', where);

      return { response, validate };
  }

  private async getQueryInsert(
      value: any,
      table: string,
      task: task
  ): Promise<string> {
      if (value) {
          if (task === 'INSERT')
              return `INTO ${table} (${await value.selectors}) VALUES (${await value.values})`;
          else if (task === 'UPDATE') return `${table}`;
          else return '';
      } else throw new Error(`the value: ${value} don't have the correct type`);
  }

  private async taskSelect(
      exeQuery: any,
      selection: string | undefined,
      table: string,
      options?: dataOptions
  ) {
      const doConsult = exeQuery(`${selection} FROM ${table}`);
      const consult: any[] = await doConsult;
      if (consult.length == 1 && options?.where)
          return { code: 200, data: await consult[0] };
      return { code: 200, data: consult };
  }
  private async taskInsert(
      validator: dataResponse,
      exeQuery: any,
      value: queryParam,
      table: string
  ) {
      const errorMessage = {
          code: 404,
          data: { message: 'error was happened' },
      };
      if (validator.code == 200) {
          const doConsult = exeQuery(
              await this.getQueryInsert(value, table, 'INSERT')
          );
          const checkResponse = await doConsult;
          if (checkResponse.affectedRows > 0)
              return { code: 201, data: { message: 'data was created' } };
          return errorMessage;
      } else {
          return validator;
      }
  }

  private async taskDelete(exeQuery: any, table: string) {
      const doConsult = exeQuery(`FROM ${table}`);
      const checkResponse = await doConsult;
      if (checkResponse.affectedRows > 0)
          return { code: 200, data: { message: 'data was deleted' } };
      return { code: 404, data: { message: 'value Not found' } };
  }

  private async taskUpdate(
      exeQuery: any,
      table: string,
      validator: dataResponse,
      value: queryParam
  ) {
      if (validator.code === 200) {
          const doConsult = exeQuery(
              await this.getQueryInsert(value, table, 'UPDATE')
          );
          const checkResponse = await doConsult;
          if (checkResponse.affectedRows > 0)
              return { code: 200, data: { message: 'data was update' } };
          return { code: 404, data: { message: 'error was happened' } };
      } else {
          return validator;
      }
  }

  async queryLogic(task: task, data: data): Promise<any> {
      let value: any;
      let optionDo: { response: string; validate: dataResponse } | undefined;
      let passOptions: any = '';
      let validator: dataResponse = { code: 200 };

      const table = this.table;
      const { selection, options, values } = data;

      if (options) {
          optionDo = await this.optionsLogic(options, values, task);
          passOptions = optionDo ? optionDo.response : '';
          validator = optionDo ? optionDo.validate : { code: 200 };
      }

      const exeQuery = async (fill: string) =>
          await this.query(`${task} ${fill}${passOptions}`);

      if (values) {
          value = await this.foerEachParams(this.convertIntoArray(values), true);
      }

      switch (task) {
      case 'SELECT':
          return await this.taskSelect(exeQuery, selection, table, options);
      case 'INSERT':
          return await this.taskInsert(validator, exeQuery, value, table);
      case 'DELETE':
          return await this.taskDelete(exeQuery, table);
      case 'UPDATE':
          return await this.taskUpdate(exeQuery, table, validator, value);
      default:
          console.error(`the request (${task}) Is not valid `);
          return {
              code: 400,
              data: { message: `the request (${task}) Is not valid ` },
          };
      }
  }
}

export default DataBaseController;
