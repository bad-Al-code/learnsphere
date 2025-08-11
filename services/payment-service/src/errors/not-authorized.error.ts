import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom.error';

export class NotAuthorizedError extends CustomError {
  statusCode: number = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not Authorized' }];
  }
}
