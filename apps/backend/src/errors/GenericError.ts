/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkError } from './NetworkError';

export class GenericError extends NetworkError<'Error', any> {
  constructor(code: number, errors: any[]) {
    super(code, 'Error', ...errors);
  }
}
