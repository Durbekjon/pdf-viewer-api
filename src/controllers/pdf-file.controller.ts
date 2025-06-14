import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { PdfFileService } from '../services/pdf-file.service';
import { CreatePdfFileDto, CreatePdfChunkDto, PdfFileResponseDto } from '../dto/pdf-file.dto';

@ApiTags('pdf-files')
@Controller('publications/:publicationId/pdf-files')
export class PdfFileController {
  constructor(private readonly pdfFileService: PdfFileService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a PDF file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'PDF file uploaded successfully', type: PdfFileResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('publicationId') publicationId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [ ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const createPdfFileDto: CreatePdfFileDto = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      data: file.buffer.toString('base64'),
    };

    return this.pdfFileService.create(publicationId, createPdfFileDto);
  }

  @Post(':pdfId/chunks')
  @ApiOperation({ summary: 'Upload a PDF chunk' })
  @ApiResponse({ status: 201, description: 'PDF chunk uploaded successfully' })
  createChunk(
    @Param('publicationId') publicationId: string,
    @Param('pdfId') pdfId: string,
    @Body() createPdfChunkDto: CreatePdfChunkDto,
  ) {
    return this.pdfFileService.createChunk(publicationId, pdfId, createPdfChunkDto);
  }

  @Get(':pdfId')
  @ApiOperation({ summary: 'Get a PDF file' })
  @ApiResponse({ status: 200, description: 'Return the PDF file', type: PdfFileResponseDto })
  @ApiResponse({ status: 404, description: 'PDF file not found' })
  findOne(@Param('publicationId') publicationId: string, @Param('pdfId') pdfId: string) {
    return this.pdfFileService.findOne(publicationId, pdfId);
  }

  @Delete(':pdfId')
  @ApiOperation({ summary: 'Delete a PDF file' })
  @ApiResponse({ status: 200, description: 'PDF file deleted successfully' })
  @ApiResponse({ status: 404, description: 'PDF file not found' })
  remove(@Param('publicationId') publicationId: string, @Param('pdfId') pdfId: string) {
    return this.pdfFileService.remove(publicationId, pdfId);
  }
} 