import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://192.168.1.61:5173', // React dev server (Vite)
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
