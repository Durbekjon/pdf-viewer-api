import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OutlineService } from '../services/outline.service';
import { CreateOutlineDto, UpdateOutlineDto, OutlineResponseDto } from '../dto/outline.dto';

@ApiTags('outlines')
@Controller('publications/:publicationId/outlines')
export class OutlineController {
  constructor(private readonly outlineService: OutlineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new outline' })
  @ApiResponse({ status: 201, description: 'Outline created successfully', type: OutlineResponseDto })
  create(
    @Param('publicationId') publicationId: string,
    @Body() createOutlineDto: CreateOutlineDto,
  ) {
    return this.outlineService.create(publicationId, createOutlineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all outlines for a publication' })
  @ApiResponse({ status: 200, description: 'Return all outlines', type: [OutlineResponseDto] })
  findAll(@Param('publicationId') publicationId: string) {
    return this.outlineService.findAll(publicationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an outline by id' })
  @ApiResponse({ status: 200, description: 'Return the outline', type: OutlineResponseDto })
  @ApiResponse({ status: 404, description: 'Outline not found' })
  findOne(
    @Param('publicationId') publicationId: string,
    @Param('id') id: string,
  ) {
    return this.outlineService.findOne(publicationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an outline' })
  @ApiResponse({ status: 200, description: 'Outline updated successfully', type: OutlineResponseDto })
  @ApiResponse({ status: 404, description: 'Outline not found' })
  update(
    @Param('publicationId') publicationId: string,
    @Param('id') id: string,
    @Body() updateOutlineDto: UpdateOutlineDto,
  ) {
    return this.outlineService.update(publicationId, id, updateOutlineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an outline' })
  @ApiResponse({ status: 200, description: 'Outline deleted successfully' })
  @ApiResponse({ status: 404, description: 'Outline not found' })
  remove(
    @Param('publicationId') publicationId: string,
    @Param('id') id: string,
  ) {
    return this.outlineService.remove(publicationId, id);
  }
} 