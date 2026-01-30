import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS чтобы фронтенд мог обращаться к API
  app.enableCors({
    origin: 'http://localhost:3001', // адрес фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Backend running on http://localhost:3000');
}
bootstrap();
