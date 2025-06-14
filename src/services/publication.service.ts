import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto, UpdatePublicationDto } from '../dto/publication.dto';
import { Publication } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationService {
  constructor(private prisma: PrismaService) {}

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    return this.prisma.publication.create({
      data: {...createPublicationDto, publishedAt: new Date(), },
    });
  }

  async findAll(page = 1, limit = 10, sort = 'publishedAt', order = 'desc') {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.publication.count(),
      this.prisma.publication.findMany({
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          pdfFiles: true,
          outlines: true,
        },
      }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Publication> {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        pdfFiles: true,
        outlines: true,
      },
    });

    if (!publication) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.publication.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return publication;
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    try {
      return await this.prisma.publication.update({
        where: { id },
        data: updatePublicationDto,
      });
    } catch (error) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.publication.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }
  }

  async incrementView(id: string): Promise<Publication> {
    try {
      return await this.prisma.publication.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1
          }
        },
        include:{
          pdfFiles:true,
          outlines:true
        }
      });
    } catch (error) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }
  }
} 