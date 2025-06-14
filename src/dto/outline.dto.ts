import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOutlineDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class UpdateOutlineDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class OutlineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  parentId?: string;

  @ApiProperty({ type: [OutlineResponseDto] })
  children?: OutlineResponseDto[];
} 