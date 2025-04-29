import { Request } from 'express';
import { CurrentUserInterface } from './current-user.interface';

export interface AuthRequest extends Request {
  user: CurrentUserInterface;
}
