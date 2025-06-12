import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Multer } from 'multer';
import { Language } from '@prisma/client';

@Injectable()
export class PdfService {
    private readonly uploadsDir = path.join(process.cwd(), 'uploads');

    constructor(private readonly prisma: PrismaService) {
        this.ensureUploadsDirectory();
    }

    private async ensureUploadsDirectory() {
        try {
            await fs.access(this.uploadsDir);
        } catch {
            await fs.mkdir(this.uploadsDir, { recursive: true });
        }
    }

    async savePdf(file: Express.Multer.File, language: Language) {
        try {
            const fileName = `${uuidv4()}.pdf`;
            const filePath = path.join(this.uploadsDir, fileName);

            // Save file to disk
            await fs.writeFile(filePath, file.buffer);

            // Save file info to database
            return await this.prisma.pdf.create({
                data: {
                    file: `uploads/${fileName}`,
                    language,
                },
            });
        } catch (error) {
            // Clean up file if database operation fails
            if (file) {
                try {
                    const filePath = path.join(this.uploadsDir, file.originalname);
                    await fs.unlink(filePath);
                } catch (unlinkError) {
                    // Log unlink error but don't throw
                    console.error('Error cleaning up file:', unlinkError);
                }
            }
            throw new InternalServerErrorException('Failed to save PDF');
        }
    }

    async findAll() {
        return this.prisma.pdf.findMany({
            select: {
                id: true,
                file: true,
                language: true,
            },
        });
    }

    async findByLanguage(language: Language) {
        const pdfs = await this.prisma.pdf.findMany({
            where: { language },
            select: {
                id: true,
                file: true,
                language: true,
            },
        });

        if (!pdfs.length) {
            throw new NotFoundException(`No PDFs found for language: ${language}`);
        }

        return pdfs;
    }

    async findById(id: string) {
        const pdf = await this.prisma.pdf.findUnique({
            where: { id },
            select: {
                id: true,
                file: true,
                language: true,
            },
        });

        if (!pdf) {
            throw new NotFoundException(`PDF with ID ${id} not found`);
        }

        return pdf;
    }

    async deleteById(id: string) {
        const pdf = await this.prisma.pdf.findUnique({
            where: { id },
        });

        if (!pdf) {
            throw new NotFoundException(`PDF with ID ${id} not found`);
        }

        // Delete file from disk
        const filePath = path.join(process.cwd(), pdf.file);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        // Delete from database
        await this.prisma.pdf.delete({
            where: { id },
        });

        return { message: 'PDF deleted successfully' };
    }

    async deleteByLanguage(language: Language) {
        const pdfs = await this.prisma.pdf.findMany({
            where: { language },
        });

        if (!pdfs.length) {
            throw new NotFoundException(`No PDFs found for language: ${language}`);
        }

        // Delete files from disk
        for (const pdf of pdfs) {
            const filePath = path.join(process.cwd(), pdf.file);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        // Delete from database
        await this.prisma.pdf.deleteMany({
            where: { language },
        });

        return { message: `All PDFs for language ${language} deleted successfully` };
    }
}
