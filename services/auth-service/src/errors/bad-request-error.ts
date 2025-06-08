import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors(): { message: string; fields?: string }[] {
    return [{ message: this.message }];
  }
}
