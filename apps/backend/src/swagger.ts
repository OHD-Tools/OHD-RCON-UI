import {
  ISwaggerExpressOptions,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { EnvService } from './env/env.service';
const env = new EnvService();
export const swaggerConfig: ISwaggerExpressOptions = {
  definition: {
    info: {
      title: 'OHD-RCON-UI API',
      version: '1.0',
      license: {
        name: 'MIT',
        url: 'https://github.com/OHD-Tools/OHD-RCON-UI/blob/main/LICENSE',
      },
    },
    schemes: ['https', 'http'],
    consumes: [SwaggerDefinitionConstant.Consume.JSON],
    produces: [SwaggerDefinitionConstant.Produce.JSON],
    securityDefinitions: {
      OHDBearerAuth: {
        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: SwaggerDefinitionConstant.Security.In.HEADER,
        name: 'Authorization',
      },
      OHDQueryAuth: {
        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: SwaggerDefinitionConstant.Security.In.QUERY,
        name: 'api_key',
      },
      OHDTokenAuth: {
        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: SwaggerDefinitionConstant.Security.In.HEADER,
        name: 'X-API-Key',
      },
    },
    host: env.BACKEND_HOST,
    basePath: '/',
  },
  path: '/swagger.json',
};
