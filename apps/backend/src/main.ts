import { bindContainer } from '~/bindContainer';
import { container } from '~/container';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AuthProvider } from '~/auth/auth.provider';
import { EnvService } from '~env/env.service';
import chalk from 'chalk';
import cors from 'cors';
import { methodToColor } from '~utils/methodToColor';
import { Logger } from '~utils/logger';
import {
  json,
  urlencoded,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import './v1';
import { setupModels } from './connection';
import { NotFoundError } from './errors/NotFoundError';
import { NetworkError } from './errors/NetworkError';
import { ZodError } from 'zod';

const createServer = () => {
  bindContainer(container);
  const env = new EnvService();
  setupModels(env);
  //? DB Connection
  const server = new InversifyExpressServer(
    container,
    null,
    null,
    null,
    AuthProvider,
  );
  server.setConfig((app) => {
    app.use(cors({ origin: [env.FRONTEND_HOST, env.BACKEND_HOST] }));
    app.use((req, _res, next) => {
      const method = methodToColor(req.method);
      const type = chalk.bold.bgMagenta('[$NET]');
      Logger.withType(
        type,
        `${req.ip} > ${chalk.cyan(req.protocol.toUpperCase())}/${chalk.cyan(req.httpVersion)} ${method} ${chalk.underline(req.path)}`,
      );
      Logger.withType(
        type,
        `${req.ip} > ${chalk.cyan('Connection')}: ${chalk.underline(req.headers.connection)}`,
      );
      Logger.withType(
        type,
        `${req.ip} > ${chalk.cyan('User-Agent')}: ${chalk.underline(req.headers['user-agent'])}`,
      );
      Logger.withType(
        type,
        `${req.ip} > ${chalk.cyan('Accept')}: ${chalk.underline(req.headers.accept)}`,
      );
      if (req.headers['content-type']) {
        Logger.withType(
          type,
          `${req.ip} > ${chalk.cyan('Content-Type')}: ${chalk.underline(req.headers['content-type'])}`,
        );
        Logger.withType(
          type,
          `${req.ip} > ${chalk.cyan('Content-Length')}: ${chalk.underline(req.headers['content-length'])}`,
        );
      }
      next();
    });
    app
      .disable('x-powered-by')
      .use(json())
      .use(urlencoded({ extended: true }));
  });

  const app = server.build();
  app.use((req, _res, next) => {
    next(new NotFoundError(req.path));
  });

  app.use((err: unknown, _req: Request, res: Response, _: NextFunction) => {
    if (err instanceof NetworkError) {
      Logger.warn(err.name);
      res.status(err.statusCode).json(err);
    } else if (err instanceof ZodError) {
      Logger.warn(`ZOD: ${err.message}`);
      res.status(400).json(err);
    } else {
      Logger.error(err);
      res.status(500).send('An unexpected error has occured');
    }
  });

  app.listen(env.EXPRESS_PORT, () => {
    Logger.init();
    Logger.info(`Listening on port ${env.EXPRESS_PORT}`);
  });
};

createServer();
