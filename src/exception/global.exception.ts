import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    console.log({ exception: exception.constructor });
    response.status(503).json(this.globalResponse(0, '', exception));
  }
  globalResponse(status, message, cause) {
    return {
      status,
      message,
      cause,
    };
  }
}
