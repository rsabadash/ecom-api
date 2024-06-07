import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EMPTY_SPACE } from '../constants/reg-exp.contants';

export class TranslationsDto {
  @IsString()
  @Matches(RegExp(EMPTY_SPACE), {
    message: ({ property }) => `${property} should not be empty`,
  })
  @ApiProperty({
    description: 'Ukrainian translation',
  })
  readonly uk: string;

  @IsString()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ApiPropertyOptional({
    description: 'English translation',
    nullable: true,
    default: null,
  })
  readonly en: string | null = null;
}
