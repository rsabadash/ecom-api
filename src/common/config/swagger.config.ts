import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ecom API')
  .setVersion('1.0')
  .addTag('Ecom')
  .build();
