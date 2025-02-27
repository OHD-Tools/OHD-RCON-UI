import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { EnvService } from '../env/env.service';
import { INJECT } from '../INJECTS';
import { ApiPermission } from './ApiPermission';
@injectable()
export class AuthService {
  constructor() {
    Logger.init();
  }
  @inject(INJECT.EnvService) declare private readonly envars: EnvService;

  verifyToken(token: string) {
    return jwt.verify(token, Buffer.from(this.envars.AUTH_SECRET, 'base64'), {
      algorithms: ['HS512'],
    }) as {
      jti: string;
      id: string;
      exp: number;
      type: 'access' | 'refresh' | 'api';
      roles: ApiPermission[];
    };
  }

  async getUserToken(token: string) {
    let decoded!: string | jwt.JwtPayload;
    try {
      decoded = this.verifyToken(token);
    } catch (e) {
      Logger.error(e);
      return null;
    }
    const tokenDecoded = decoded as unknown;
    return tokenDecoded as ReturnType<typeof this.verifyToken> | null;
  }
}
