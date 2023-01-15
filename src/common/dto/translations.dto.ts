import { IsOptional, IsString } from 'class-validator';

export class TranslationsDto {
  @IsString()
  readonly uk: string;

  @IsString()
  @IsOptional()
  readonly en: string | null;
}
