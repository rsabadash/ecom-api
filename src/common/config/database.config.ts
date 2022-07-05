import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: 'r_sabadash',
  password: 'comics_db',
  name: 'Leisure',
  host: 'cluster0.yfpvwip.mongodb.net',
}));
