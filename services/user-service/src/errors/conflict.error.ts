import { StatusCodes } from 'http-status-codes';

import { CustomError } from './custom-error';

type ErrorDetails = { message: string; field?: string };

export class ConflictError extends CustomError {
  statusCode: number = StatusCodes.CONFLICT;

  constructor(public details: string | ErrorDetails[]) {
    super(typeof details === 'string' ? details : 'Resource conflict');

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    if (typeof this.details === 'string') {
      return [{ message: this.details }];
    }

    return this.details;
  }
}
