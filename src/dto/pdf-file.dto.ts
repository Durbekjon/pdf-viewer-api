import { IsString, IsNumber, IsBoolean, IsOptional, IsBase64 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePdfFileDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiProperty()
  @IsBase64()
  data: string;
}

export class CreatePdfChunkDto {
  @ApiProperty()
  @IsNumber()
  chunkIndex: number;

  @ApiProperty()
  @IsBase64()
  data: string;
}

export class PdfFileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  isChunked: boolean;

  @ApiProperty()
  totalChunks?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  file: string;
}

export class PdfChunkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chunkIndex: number;

  @ApiProperty()
  createdAt: Date;
} 