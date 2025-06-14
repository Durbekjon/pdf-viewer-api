import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePdfFileDto, CreatePdfChunkDto } from '../dto/pdf-file.dto';
import { PdfFile, PdfChunk } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdfFileService {
  private readonly CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private prisma: PrismaService) {}

  async create(publicationId: string, createPdfFileDto: CreatePdfFileDto): Promise<PdfFile> {
    const { name, type, size, data } = createPdfFileDto;

    const isChunked = size > this.CHUNK_SIZE;
    const totalChunks = isChunked ? Math.ceil(size / this.CHUNK_SIZE) : null;

    // Save file to disk
    const filePath = path.join('uploads', `${publicationId}_${name}`);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

    return this.prisma.pdfFile.create({
      data: {
        name,
        type,
        size,
        isChunked,
        totalChunks,
        file: filePath,
        publication: {
          connect: { id: publicationId },
        },
      },
    });
  }

  async createChunk(
    publicationId: string,
    pdfId: string,
    createPdfChunkDto: CreatePdfChunkDto,
  ): Promise<PdfChunk> {
    const { chunkIndex, data } = createPdfChunkDto;

    const pdfFile = await this.prisma.pdfFile.findFirst({
      where: {
        id: pdfId,
        publicationId,
      },
    });

    if (!pdfFile) {
      throw new NotFoundException(`PDF file with ID ${pdfId} not found`);
    }

    if (!pdfFile.isChunked) {
      throw new BadRequestException('This PDF file is not configured for chunked uploads');
    }

    if (chunkIndex >= (pdfFile.totalChunks || 0)) {
      throw new BadRequestException('Chunk index exceeds total chunks');
    }

    return this.prisma.pdfChunk.create({
      data: {
        chunkIndex,
        data,
        pdfFile: {
          connect: { id: pdfId },
        },
      },
    });
  }

  async findOne(publicationId: string, pdfId: string): Promise<PdfFile> {
    const pdfFile = await this.prisma.pdfFile.findFirst({
      where: {
        id: pdfId,
        publicationId,
      },
      include: {
        chunks: true,
      },
    });

    if (!pdfFile) {
      throw new NotFoundException(`PDF file with ID ${pdfId} not found`);
    }

    return pdfFile;
  }

  async remove(publicationId: string, pdfId: string): Promise<void> {
    const pdfFile = await this.prisma.pdfFile.findFirst({
      where: {
        id: pdfId,
        publicationId,
      },
    });

    if (!pdfFile) {
      throw new NotFoundException(`PDF file with ID ${pdfId} not found`);
    }

    // Delete file from disk
    try {
      fs.unlinkSync(pdfFile.file);
    } catch (error) {
      console.error(`Error deleting file ${pdfFile.file}:`, error);
    }

    // Delete from database (cascade will handle chunks)
    await this.prisma.pdfFile.delete({
      where: { id: pdfId },
    });
  }
} 