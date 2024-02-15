import { Request } from 'express';
import { UserEntity } from '../user.entity';

export interface ExpressRequsetWithoutHeadersInterface extends Request {
  user?: UserEntity;
}

export type ExpressRequsetInterface = ExpressRequsetWithoutHeadersInterface & {
  headers: { authorization: string };
};
