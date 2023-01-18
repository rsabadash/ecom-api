import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HttpErrorDto {
  @ApiProperty({ description: 'Status code' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Message' })
  readonly message: string;

  @ApiPropertyOptional({ description: 'Error itself' })
  readonly error: string;
}
