// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
    DATABASE_CONNECTION_SCHEME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_HOST: string;
    DATABASE_NAME: string;
    DATABASE_QUERY: string;
    JWT_SECRET: string;
    JWT_TOKEN_AUDIENCE: string;
    JWT_TOKEN_ISSUER: string;
    JWT_ACCESS_TOKEN_TTL: string;
    JWT_REFRESH_TOKEN_TTL: string;
  }
}
