import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOutlineDto, UpdateOutlineDto } from '../dto/outline.dto';
import { Outline } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutlineService {
  constructor(private prisma: PrismaService) {}

  async create(publicationId: string, createOutlineDto: CreateOutlineDto): Promise<Outline> {
    const { title, page, parentId } = createOutlineDto;

    return this.prisma.outline.create({
      data: {
        title,
        page,
        publication: {
          connect: { id: publicationId },
        },
        ...(parentId && {
          parent: {
            connect: { id: parentId },
          },
        }),
      },
    });
  }

  async findAll(publicationId: string): Promise<Outline[]> {
    return this.prisma.outline.findMany({
      where: {
        publicationId,
        parentId: null, // Get only root outlines
      },
      include: {
        children: {
          include: {
            children: true, // Recursively include all children
          },
        },
      },
    });
  }

  async findOne(publicationId: string, outlineId: string): Promise<Outline> {
    const outline = await this.prisma.outline.findFirst({
      where: {
        id: outlineId,
        publicationId,
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!outline) {
      throw new NotFoundException(`Outline with ID ${outlineId} not found`);
    }

    return outline;
  }

  async update(
    publicationId: string,
    outlineId: string,
    updateOutlineDto: UpdateOutlineDto,
  ): Promise<Outline> {
    const { title, page, parentId } = updateOutlineDto;

    try {
      return await this.prisma.outline.update({
        where: { id: outlineId },
        data: {
          title,
          page,
          ...(parentId && {
            parent: {
              connect: { id: parentId },
            },
          }),
        },
      });
    } catch (error) {
      throw new NotFoundException(`Outline with ID ${outlineId} not found`);
    }
  }

  async remove(publicationId: string, outlineId: string): Promise<void> {
    try {
      await this.prisma.outline.delete({
        where: { id: outlineId },
      });
    } catch (error) {
      throw new NotFoundException(`Outline with ID ${outlineId} not found`);
    }
  }
} 