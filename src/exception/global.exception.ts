import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(503).json({
      status: 0,
      message: 'Something went wrong',
      cause: exception,
    });
  }
}
