import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicationService } from '../services/publication.service';
import { CreatePublicationDto, UpdatePublicationDto, PublicationResponseDto } from '../dto/publication.dto';

@ApiTags('publications')
@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new publication' })
  @ApiResponse({ status: 201, description: 'Publication created successfully', type: PublicationResponseDto })
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationService.create(createPublicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all publications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return all publications' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('publishedAt')) sort: string,
    @Query('order', new DefaultValuePipe('desc')) order: 'asc' | 'desc',
  ) {
    return this.publicationService.findAll(page, limit, sort, order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a publication by id' })
  @ApiResponse({ status: 200, description: 'Return the publication', type: PublicationResponseDto })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  findOne(@Param('id') id: string) {
    return this.publicationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a publication' })
  @ApiResponse({ status: 200, description: 'Publication updated successfully', type: PublicationResponseDto })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  update(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
    return this.publicationService.update(id, updatePublicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a publication' })
  @ApiResponse({ status: 200, description: 'Publication deleted successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  remove(@Param('id') id: string) {
    return this.publicationService.remove(id);
  }

  @Put(':id/increment-view')
  @ApiOperation({ summary: 'Increment publication view count' })
  @ApiResponse({ status: 200, description: 'View count incremented successfully', type: PublicationResponseDto })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  incrementView(@Param('id') id: string) {
    return this.publicationService.incrementView(id);
  }
} 