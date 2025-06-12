import { Controller, Post, Get, Delete, Query, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { Language } from '@prisma/client';
import type { Multer } from 'multer';

@ApiTags('PDF')
@Controller({ path: 'pdf', version: '1' })
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload a PDF file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                language: {
                    type: 'uz | en | ru',
                    enum: Object.values(Language),
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Query('language') language: Language,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!language || !Object.values(Language).includes(language)) {
            throw new BadRequestException('Invalid language');
        }

        if (!file.mimetype.includes('pdf')) {
            throw new BadRequestException('Only PDF files are allowed');
        }

        return this.pdfService.savePdf(file, language);
    }

    @Get()
    @ApiOperation({ summary: 'Get all PDFs' })
    @ApiResponse({ status: 200, description: 'Returns all PDFs' })
    async findAll() {
        return this.pdfService.findAll();
    }

    @Get('language/:language')
    @ApiOperation({ summary: 'Get PDFs by language' })
    @ApiResponse({ status: 200, description: 'Returns PDFs for the specified language' })
    @ApiResponse({ status: 404, description: 'No PDFs found for the specified language' })
    async findByLanguage(@Param('language') language: Language) {
        return this.pdfService.findByLanguage(language);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get PDF by ID' })
    @ApiResponse({ status: 200, description: 'Returns the PDF with the specified ID' })
    @ApiResponse({ status: 404, description: 'PDF not found' })
    async findById(@Param('id') id: string) {
        return this.pdfService.findById(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete PDF by ID' })
    @ApiResponse({ status: 200, description: 'PDF deleted successfully' })
    @ApiResponse({ status: 404, description: 'PDF not found' })
    async deleteById(@Param('id') id: string) {
        return this.pdfService.deleteById(id);
    }

    @Delete('language/:language')
    @ApiOperation({ summary: 'Delete all PDFs by language' })
    @ApiResponse({ status: 200, description: 'All PDFs for the specified language deleted successfully' })
    @ApiResponse({ status: 404, description: 'No PDFs found for the specified language' })
    async deleteByLanguage(@Param('language') language: Language) {
        return this.pdfService.deleteByLanguage(language);
    }
}
