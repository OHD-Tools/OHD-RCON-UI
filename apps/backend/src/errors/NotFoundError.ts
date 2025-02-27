import { NetworkError } from './NetworkError';

export class NotFoundError extends NetworkError<'NotFound', { path: string }> {
  constructor(path: string) {
    super(404, 'NotFound', {
      code: 'invalid_resource',
      message: 'Resource not found',
      path,
    });
  }
}
