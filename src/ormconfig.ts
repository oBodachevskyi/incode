// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { UserEntity } from './user/user.entity';

const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;

const config: PostgresConnectionOptions = {
  host: 'localhost',
  port: 5433,
  database: DB_NAME,
  username: DB_USER,
  password: DB_USER_PASSWORD,
  type: 'postgres',
  entities: [UserEntity],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;
