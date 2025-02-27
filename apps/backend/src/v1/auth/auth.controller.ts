import { BaseHttpController, controller } from 'inversify-express-utils';
import { EnvService } from '~env/env.service';
import { inject } from 'inversify';
import { INJECT } from '~INJECTS';
import { AuthService } from './auth.service';

const _env = new EnvService();
@controller('/v1/auth')
export class AuthController extends BaseHttpController {
  constructor(
    @inject(INJECT.AuthService) private readonly authService: AuthService,
  ) {
    super();
  }
}
