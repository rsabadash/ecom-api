import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG_KEY } from '../constants/config.constants';

export default registerAs(DATABASE_CONFIG_KEY, () => ({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  scheme: process.env.DATABASE_CONNECTION_SCHEME,
  query: process.env.DATABASE_QUERY,
}));

// export default registerAs('database', () => ({
//   user: 'r_sabadash',
//   password: 'commerce_db',
//   name: 'commerce',
//   host: 'cluster0.zblgqd0.mongodb.net',
// }));
