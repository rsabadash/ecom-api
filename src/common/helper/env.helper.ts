import { existsSync } from 'fs';
import { resolve } from 'path';

export const getEnvPath = (dest: string): string => {
  const env: string | undefined = process.env.NODE_ENV;
  const filename: string = env ? `${env}.env` : 'development.env';
  const filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    return resolve(`${dest}/.env`);
  }

  return filePath;
};
