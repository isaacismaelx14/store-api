

import {ConnectionConfig} from 'mysql';
import { options } from './db.interfaces';

type config = ConnectionConfig;
type dataOptions = options | null;
type queryParam = queryParams[] | queryParams;
type queryParams = { selector: string; value: unknown };
type task = 'SELECT' | 'UPDATE' | 'DELETE' | 'INSERT';
type validator = { selector: string };

export {config, dataOptions, queryParam, queryParams, task, validator};