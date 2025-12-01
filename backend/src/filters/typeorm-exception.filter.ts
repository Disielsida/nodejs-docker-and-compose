import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if ((exception as any).code === '23505') {
      return response
        .status(400)
        .json({ message: 'Email или имя пользователя уже заняты' });
    }

    return response.status(500).json({
      message: 'Ошибка базы данных',
      detail: (exception as any).detail || exception.message,
    });
  }
}
