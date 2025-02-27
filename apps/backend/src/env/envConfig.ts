export const envConfig = {
  FRONTEND_HOST: {
    type: 'string',
    description: '',
    optional: true,
    default: 'http://localhost:3000',
  },
  BACKEND_HOST: {
    type: 'string',
    description: '',
    optional: true,
    default: 'http://localhost:3030',
  },
  DB_DIALECT: {
    type: 'string',
    description:
      "'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle'",
    optional: true,
    default: 'mysql',
  },
  DB_DATABASE: {
    type: 'string',
    description: 'Self Explanatory',
    optional: false,
    default: null,
  },
  DB_USER: {
    type: 'string',
    description: 'Self Explanatory',
    optional: false,
    default: null,
  },
  DB_PASSWORD: {
    type: 'string',
    description: 'Self Explanatory',
    optional: false,
    default: null,
  },
  DB_HOST: {
    type: 'string',
    description: 'Self Explanatory',
    optional: false,
    default: null,
  },
  DB_PORT: {
    type: 'number',
    description: 'Probably 3306',
    optional: true,
    default: 3306,
  },
  EXPRESS_PORT: {
    type: 'number',
    description: 'Probably 3030',
    optional: true,
    default: 3030,
  },
  AUTH_SECRET: {
    type: 'string',
    description: "openssl rand -base64 172 | tr -d '\\n'",
    optional: false,
    default: null,
  },
  LOGFILE: {
    type: 'string',
    description: 'Exact path to log output',
    optional: true,
    default: null,
  },
} as const;
export type EnvironmentConfig = {
  [Property in keyof typeof envConfig]: (typeof envConfig)[Property]['optional'] extends true
    ? (typeof envConfig)[Property]['type'] extends `string`
      ? string | (typeof envConfig)[Property]['default']
      : (typeof envConfig)[Property]['type'] extends `number`
        ? number | (typeof envConfig)[Property]['default']
        : unknown | (typeof envConfig)[Property]['default']
    : (typeof envConfig)[Property]['type'] extends `string`
      ? string
      : (typeof envConfig)[Property]['type'] extends `number`
        ? number
        : unknown;
};
