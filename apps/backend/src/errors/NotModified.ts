import { NetworkError } from './NetworkError';

export class NotModified extends NetworkError<'NotModified', { path: string }> {
  constructor(path: string) {
    super(304, 'NotModified', {
      code: 'not_modified',
      message: 'Resource not modified',
      path,
    });
  }
}
