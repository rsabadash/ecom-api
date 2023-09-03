import { REQUEST_USER_KEY } from '../constants/request.constants';

export interface RequestExtended extends Request {
  [REQUEST_USER_KEY]?: {
    sub: string;
  };
}
