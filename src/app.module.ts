import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { PublicationController } from './controllers/publication.controller';
import { PdfFileController } from './controllers/pdf-file.controller';
import { OutlineController } from './controllers/outline.controller';
import { PublicationService } from './services/publication.service';
import { PdfFileService } from './services/pdf-file.service';
import { OutlineService } from './services/outline.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, PublicationController, PdfFileController, OutlineController],
  providers: [AppService,PublicationService, PdfFileService, OutlineService],
})
export class AppModule {}
