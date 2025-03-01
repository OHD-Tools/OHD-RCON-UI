import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { AnonymousPrincipal } from './anonymous.principal';
import { INJECT } from '~INJECTS';
import { AuthService } from '~v1/auth/auth.service';
import { OHDUserPrincipal } from './ohduser.principal';
import { ApiToken } from '~v1/auth/api_token.model';
import { Op } from 'sequelize';
import { User } from '~v1/users/user.model';

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @inject(INJECT.AuthService) declare private readonly authService: AuthService;

  async getUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<interfaces.Principal> {
    const bearerHeader: string | undefined = req.headers['authorization'];
    const api_key: string | undefined =
      (req.headers['x-api-key'] as string) ?? (req.query.api_key as string);
    if (bearerHeader == null && api_key == null)
      return new AnonymousPrincipal(false);

    let decodedUser: Awaited<ReturnType<AuthService['getUserToken']>> = null;

    if (bearerHeader != null) {
      //? Bearer Token
      const [type, token] =
        bearerHeader?.split?.(' ') ?? ([null, null] as const);

      //? Invalid header
      if (
        type == null ||
        token == null ||
        (type.toLowerCase() !== 'bearer' && type.toLowerCase() !== 'bot')
      )
        return new AnonymousPrincipal(false);

      decodedUser = this.authService.getUserToken(token);

      if (
        decodedUser == null ||
        (type.toLowerCase() === 'bot' && decodedUser.type !== 'api')
      )
        return new AnonymousPrincipal(false);
    } else {
      //? Api Token
      decodedUser = this.authService.getUserToken(api_key);
      if (decodedUser?.type !== 'api') return new AnonymousPrincipal(false);
    }

    if (decodedUser == null) return new AnonymousPrincipal(false);

    const validToken = await ApiToken.findOne({
      where: {
        user_id: decodedUser.id,
        token_id: decodedUser.jti,
        type: decodedUser.type,
        expiresAt: { [Op.gte]: Date.now() },
      },
    });
    if (validToken == null) return new AnonymousPrincipal(false);

    const details = await User.findOne({ where: { id: decodedUser.id } });
    if (details == null) return new AnonymousPrincipal(false);

    const principal = new OHDUserPrincipal(
      decodedUser.id,
      details,
      decodedUser.type,
      decodedUser.roles,
    );
    return principal;
  }
}
