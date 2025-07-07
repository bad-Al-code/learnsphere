import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

type ErrorDetails = { message: string; field?: string };

export class BadRequestError extends CustomError {
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(public details: string | ErrorDetails[]) {
    super(typeof details === "string" ? details : "Invalid request parameters");

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): { message: string; fields?: string }[] {
    if (typeof this.details === "string") {
      return [{ message: this.details }];
    }

    return this.details;
  }
}
