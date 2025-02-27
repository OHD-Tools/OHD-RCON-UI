/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkError } from './NetworkError';

export class BodyError extends NetworkError<'InvalidBody', any> {
  constructor(errors: any[]) {
    super(400, 'InvalidBody', ...errors);
  }
}
