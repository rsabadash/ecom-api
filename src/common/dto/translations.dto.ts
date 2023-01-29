import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationsDto {
  @IsString()
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
