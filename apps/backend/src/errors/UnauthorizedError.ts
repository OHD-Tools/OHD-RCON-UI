import { NetworkError } from './NetworkError';

export class UnauthorizedError extends NetworkError<
  'Unauthorized',
  Record<string, string>
> {
  constructor() {
    super(401, 'Unauthorized', {
      code: 'invalid_authorization',
      message: 'You do not have authorization to preform this action.',
    });
  }
}
