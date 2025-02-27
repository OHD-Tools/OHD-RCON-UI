/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkError } from './NetworkError';

export class BadParameterError extends NetworkError<'InvalidParameter', any> {
  constructor(parameter: string, path: string) {
    super(400, 'InvalidParameter', {
      code: 'invalid_resource',
      message: 'Invalid Parameter',
      path,
      parameter,
    });
  }
}
