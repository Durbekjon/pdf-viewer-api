import { IsString, IsDate, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class CreatePublicationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;


  @ApiProperty({ enum: Language, default: Language.uz })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}

export class UpdatePublicationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  publishedAt?: Date;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}

export class PublicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ enum: Language })
  language: Language;
} 