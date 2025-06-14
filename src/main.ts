import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  // // Configure body parser limits for large file uploads
  // app.useBodyParser('json', { limit: '200mb' });
  // app.useBodyParser('urlencoded', { limit: '200mb', extended: true });

  // Configure server timeouts
  app.getHttpServer().timeout = 0; // Remove server timeout
  app.getHttpServer().keepAliveTimeout = 0; // Remove keep-alive timeout
  app.getHttpServer().headersTimeout = 0; // Remove headers timeout

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('PDF Viewer API')
    .setDescription('API for managing PDF publications and outlines')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configure file upload limits
  app.use((req, res, next) => {
    res.setHeader('Content-Length', '0');
    next();
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  
  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

