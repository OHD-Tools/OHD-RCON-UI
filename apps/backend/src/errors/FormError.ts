/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NetIssue, NetworkError } from './NetworkError';

export class FormError extends NetworkError<'FormError', any> {
  constructor(errors: NetIssue[]) {
    super(400, 'FormError', ...errors);
  }
}
