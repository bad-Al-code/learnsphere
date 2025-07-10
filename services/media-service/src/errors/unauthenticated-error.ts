import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class UnauthenticatedError extends CustomError {
  statusCode: number = StatusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  serializeErrors(): { message: string; fields?: string }[] {
    return [{ message: this.message }];
  }
}
