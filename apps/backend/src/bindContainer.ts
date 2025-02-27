import type { Container } from 'inversify';
import { AuthService } from './auth/auth.service';
import { INJECT } from './INJECTS';
import { EnvService } from './env/env.service';

export const bindContainer = (container: Container) => {
  container
    .bind<EnvService>(INJECT.EnvService)
    .to(EnvService)
    .inSingletonScope();
  container
    .bind<AuthService>(INJECT.AuthService)
    .to(AuthService)
    .inSingletonScope();
};
