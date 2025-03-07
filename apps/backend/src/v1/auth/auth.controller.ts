import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  next,
  requestBody,
} from 'inversify-express-utils';
import { EnvService } from '~env/env.service';
import { inject } from 'inversify';
import { INJECT } from '~INJECTS';
import { AuthService } from './auth.service';
import { hasPermission } from '~utils/hasPermission';
import { ApiPermission } from '~/auth/ApiPermission';
import { NextFunction } from 'express';
import { UnauthorizedError } from '~/errors/UnauthorizedError';
import { OHDUserPrincipal } from '~/auth/ohduser.principal';
import {
  ApiOperationGet,
  ApiOperationPost,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { ApiTokenCreateSchema, IApiTokenCreateSchema } from './ApiTokenSchema';

const _env = new EnvService();
@controller('/v1/auth')
export class AuthController extends BaseHttpController {
  constructor(
    @inject(INJECT.AuthService) private readonly authService: AuthService,
  ) {
    super();
  }

  @ApiOperationGet({
    description:
      'Get user api token identifiers. Actual tokens are never stored, and thus can not be retrieved after generation.',
    responses: {
      200: {
        type: 'Success',
      },
    },
    security: {
      OHDBearerAuth: [ApiPermission.TOKENS_READ],
      OHDQueryAuth: [ApiPermission.TOKENS_READ],
      OHDTokenAuth: [ApiPermission.TOKENS_READ],
    },
  })
  @httpGet('/tokens', INJECT.AuthenticatedMiddleware)
  public async getTokens(@next() nextFunction: NextFunction) {
    const user = this.httpContext.user as OHDUserPrincipal;
    if (!(await hasPermission(user, ApiPermission.TOKENS_READ)))
      return nextFunction(new UnauthorizedError());
    return this.authService.getValidTokens(user.id, 'api');
  }

  @ApiOperationPost({
    description:
      'Get user api token identifiers. Actual tokens are never stored, and thus can not be retrieved after generation.',
    responses: {
      200: {
        type: 'Success',
      },
    },
    security: {
      OHDBearerAuth: [ApiPermission.TOKENS_READ],
      OHDQueryAuth: [ApiPermission.TOKENS_READ],
      OHDTokenAuth: [ApiPermission.TOKENS_READ],
    },
    parameters: {
      body: {
        properties: {
          expires: { type: SwaggerDefinitionConstant.STRING, required: true },
          name: { type: SwaggerDefinitionConstant.STRING, required: true },
          roles: { type: SwaggerDefinitionConstant.ARRAY, required: true },
        },
        required: true,
      },
    },
  })
  @httpPost('/tokens', INJECT.AuthenticatedMiddleware)
  public async createToken(
    @next() nextFunction: NextFunction,
    @requestBody() reqBody: IApiTokenCreateSchema,
  ) {
    const user = this.httpContext.user as OHDUserPrincipal;
    if (!(await hasPermission(user, ApiPermission.TOKENS_WRITE)))
      return nextFunction(new UnauthorizedError());
    const body = ApiTokenCreateSchema.strict().parse(reqBody);
    const token = await this.authService.createApiToken(
      user.id,
      body.expires as Date,
      'api',
      body.name,
      body.roles,
    );
    return this.created(`/v1/auth/tokens/${token.token_id}`, token);
  }
}
