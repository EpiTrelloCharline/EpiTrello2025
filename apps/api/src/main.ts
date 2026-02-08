import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function bootstrap() {
  console.log('Starting Nest application...');
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    console.log('Nest application created.');

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    // Enable CORS for frontend
    app.enableCors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3002', 'http://127.0.0.1:3002'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Enable validation
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📁 Static files served from: ${join(__dirname, '..', 'uploads')}`);
  } catch (error) {
    console.error('FATAL ERROR DURING BOOTSTRAP:');
    console.error(error);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
bootstrap();
