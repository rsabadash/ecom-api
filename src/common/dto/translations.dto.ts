import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TranslationsDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Ukrainian translation',
  })
  readonly uk: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'English translation',
    required: false,
  })
  readonly en: string | null = null;
}
