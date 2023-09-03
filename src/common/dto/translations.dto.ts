import { IsOptional, IsString, Matches } from 'class-validator';
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
  @ApiPropertyOptional({
    description: 'English translation',
    nullable: true,
    default: null,
  })
  readonly en: null | string = null;
}
