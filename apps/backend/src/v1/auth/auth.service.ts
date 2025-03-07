import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Logger } from '~utils/logger';
import { EnvService } from '~env/env.service';
import { INJECT } from '~INJECTS';
import { ApiPermission } from '~/auth/ApiPermission';
import { ApiToken } from './api_token.model';
import ms from 'ms';
import { Op } from 'sequelize';
import { IdUtil } from '~utils/IdUtil';
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

  getUserToken(token: string) {
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

  async invalidateToken(token: string, userId?: string) {
    const decoded = this.getUserToken(token);
    if (!decoded) return false;
    await ApiToken.destroy({
      where: { user_id: userId ?? decoded.id, token_id: decoded?.jti },
    });
    return true;
  }

  async getValidTokens(
    user_id: string,
    type: 'api' | 'refresh' | 'access' = 'api',
  ) {
    return ApiToken.findAll({
      where: { user_id, type, expiresAt: { [Op.gte]: Date.now() } },
    });
  }

  async createApiToken(
    user_id: string,
    expires?: Date | number | `${number}${'d' | 'h' | 's' | 'm' | 'y'}`,
    type: 'api' | 'refresh' | 'access' = 'api',
    name: string = 'User Token',
    roles: ApiPermission[] = [ApiPermission.ADMIN],
    jwtid: string = IdUtil.generateId(),
  ) {
    const expiresRange =
      typeof expires === 'string'
        ? ms(expires)
        : new Date(expires as number).getTime();
    const expiresAt = new Date(Date.now() + expiresRange);
    const token = jwt.sign(
      { id: user_id, type, roles },
      Buffer.from(this.envars.AUTH_SECRET, 'base64'),
      {
        algorithm: 'HS512',
        jwtid,
        issuer: this.envars.BACKEND_HOST,
        subject: user_id,
        audience: [this.envars.FRONTEND_HOST, this.envars.BACKEND_HOST],
        expiresIn: ms(expiresRange) as unknown as undefined, //! Why???
      },
    );

    const newToken = await ApiToken.create({
      user_id,
      name,
      type,
      token_id: jwtid,
      roles: JSON.stringify(roles),
      expiresAt,
    });
    const response = { ...newToken.toJSON(), token };
    return response;
  }

  public async createTokenPair(
    user_id: string,
    jwtid: string = IdUtil.generateId(),
  ) {
    const [access, refresh] = await Promise.all([
      this.createApiToken(
        user_id,
        '1h',
        'access',
        undefined,
        [ApiPermission.ADMIN],
        jwtid,
      ),
      this.createApiToken(
        user_id,
        '3d',
        'refresh',
        undefined,
        [ApiPermission.ADMIN],
        jwtid,
      ),
    ]);
    return { access, refresh };
  }
}
