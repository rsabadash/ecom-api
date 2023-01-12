import { IsOptional, IsString } from 'class-validator';

export class TranslationsDto {
  @IsString()
  uk: string;

  @IsString()
  @IsOptional()
  en: string | null;
}
