import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { TypeOrmExceptionFilter } from './filters/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new TypeOrmExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:8081',
      'https://podaridaydisielsida.nomorepartiessbs.ru',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
