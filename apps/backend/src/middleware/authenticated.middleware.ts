import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { OHDUserPrincipal } from '~/auth/ohduser.principal';
import { UnauthorizedError } from '~/errors/UnauthorizedError';

export class AuthenticatedMiddleware extends BaseMiddleware {
  handler(_req: Request, _res: Response, next: NextFunction) {
    const user = this.httpContext.user as OHDUserPrincipal;
    user.isAuthenticated().then((authenticated) => {
      if (!authenticated) return next(new UnauthorizedError());
      next();
    });
  }
}
