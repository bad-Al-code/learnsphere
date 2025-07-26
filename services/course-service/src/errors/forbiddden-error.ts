import { StatusCodes } from 'http-status-codes';
import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  statusCode: number = StatusCodes.FORBIDDEN;

  constructor() {
    super(
      'Access Forbidden: You do not have permission to perform this action.'
    );

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors(): { message: string; fields?: string }[] {
    return [{ message: this.message }];
  }
}
