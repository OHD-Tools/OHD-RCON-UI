import { bindContainer } from './bindContainer';
import { container } from './container';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AuthProvider } from './auth/auth.provider';
import { EnvService } from './env/env.service';
import chalk from 'chalk';
import cors from 'cors';
import { methodToColor } from './utils/methodToColor';
import { Logger } from './utils/logger';
import { json, urlencoded } from 'body-parser';

import './v1';

const createServer = () => {
  bindContainer(container);
  const env = new EnvService();
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

  app.listen(env.EXPRESS_PORT, () => {
    Logger.info(`App listening on port ${env.EXPRESS_PORT}`);
  });
};

createServer();
