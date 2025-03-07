import type { Container } from 'inversify';
import { AuthService } from '~v1/auth/auth.service';
import { INJECT } from '~INJECTS';
import { EnvService } from '~env/env.service';
import { AuthenticatedMiddleware } from './middleware/authenticated.middleware';

export const bindContainer = (container: Container) => {
  container
    .bind<EnvService>(INJECT.EnvService)
    .to(EnvService)
    .inSingletonScope();
  container
    .bind<AuthService>(INJECT.AuthService)
    .to(AuthService)
    .inSingletonScope();
  container
    .bind<AuthenticatedMiddleware>(INJECT.AuthenticatedMiddleware)
    .to(AuthenticatedMiddleware)
    .inSingletonScope();
};
