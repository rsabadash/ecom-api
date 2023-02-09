import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ATTRIBUTES_ROUTE,
  ATTRIBUTE_VARIANT_PATH,
  GET_ATTRIBUTES_BY_ID_PATH,
  ATTRIBUTES_VARIANTS_PATH,
} from './constants/route.constants';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import {
  IAttribute,
  IDeleteAttribute,
  IUpdateAttribute,
} from './interfaces/attribute.interfaces';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import { ObjectId } from 'mongodb';
import { ATTRIBUTES_ID_PARAM } from './constants/param.constants';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeVariantDto } from './dto/create-attribute-variant.dto';
import {
  IAttributeVariant,
  IDeleteAttributeValue,
  IGetAttributeValue,
} from './interfaces/attribute-variant.interfaces';
import { UpdateAttributeVariantDto } from './dto/update-attribute-variant.dto';
import { DeleteAttributeVariantDto } from './dto/delete-attribute-variant.dto';
import { AttributeDto } from './dto/attribute.dto';
import { AttributeVariantDto } from './dto/attribute-variant.dto';
import { GetAttributeVariantDto } from './dto/get-attribute-variant.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(ATTRIBUTES_ROUTE)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The attribute has been created',
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute has not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createAttribute(
    @Body() createAttributeDto: CreateAttributeDto,
  ): Promise<IAttribute> {
    return this.attributesService.createAttribute(createAttributeDto);
  }

  @Get(ATTRIBUTES_VARIANTS_PATH)
  @ApiOkResponse({
    description: 'List of attributes variants were retrieved',
    type: [AttributeVariantDto],
  })
  @ApiNoAccessResponse()
  async getAttributesVariants(): Promise<IAttributeVariant[]> {
    return await this.attributesService.getAttributesVariants();
  }

  @Get(ATTRIBUTE_VARIANT_PATH)
  @ApiOkResponse({
    description: 'List of attributes variants were retrieved',
    type: [AttributeVariantDto],
  })
  @ApiNoAccessResponse()
  @UsePipes(
    new ParseObjectIdsPipe<IGetAttributeValue>(
      ['attributeId', 'variantId'],
      ['string', 'string'],
    ),
  )
  async getAttributesVariant(
    @Body() getAttributeVariantDto: GetAttributeVariantDto,
  ): Promise<IAttributeVariant[]> {
    return await this.attributesService.getAttributeVariant(
      getAttributeVariantDto,
    );
  }

  @Get()
  @ApiOkResponse({
    description: 'List of attributes were retrieved',
    type: [AttributeDto],
  })
  @ApiNoAccessResponse()
  async getAttributes(): Promise<IAttribute[]> {
    return await this.attributesService.getAttributes();
  }

  @Get(GET_ATTRIBUTES_BY_ID_PATH)
  @ApiOkResponse({
    description: 'The attribute was retrieved',
    type: AttributeDto,
  })
  @ApiNotFoundResponse({
    description: 'The attribute has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getAttribute(
    @Param(ATTRIBUTES_ID_PARAM, ParseObjectIdPipe) attributeId: ObjectId,
  ): Promise<IAttribute> {
    return await this.attributesService.getAttribute({ attributeId });
  }

  @UsePipes(new ParseObjectIdsPipe<IUpdateAttribute>('id', 'string'))
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The attribute has been updated',
  })
  @ApiNotFoundResponse({
    description: 'The attribute has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute has not been updated',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateAttribute(
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<void> {
    await this.attributesService.updateAttribute(updateAttributeDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The attribute has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'The attribute has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute has not been deleted',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  @UsePipes(new ParseObjectIdsPipe<IDeleteAttribute>('id', 'string'))
  async deleteAttribute(
    @Body() deleteAttributeDto: DeleteAttributeDto,
  ): Promise<void> {
    await this.attributesService.deleteAttribute(deleteAttributeDto);
  }

  //Attribute variant

  @Post(ATTRIBUTE_VARIANT_PATH)
  @ApiCreatedResponse({
    description: 'The attribute variant has been created',
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute variant has not been created',
    type: HttpErrorDto,
  })
  @UsePipes(new ParseObjectIdsPipe<IAttributeVariant>('attributeId', 'string'))
  @ApiNoAccessResponse()
  async createAttributeVariant(
    @Body() createAttributeValueDto: CreateAttributeVariantDto,
  ): Promise<void> {
    return this.attributesService.createAttributeVariant(
      createAttributeValueDto,
    );
  }

  @Patch(ATTRIBUTE_VARIANT_PATH)
  @ApiCreatedResponse({
    description: 'The attribute variant has been updated',
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute variant has not been updated',
    type: HttpErrorDto,
  })
  @UsePipes(
    new ParseObjectIdsPipe<IAttributeVariant>(
      ['attributeId', 'variantId'],
      ['string', 'string'],
    ),
  )
  @ApiNoAccessResponse()
  async updateAttributeVariant(
    @Body() updateAttributeVariantDto: UpdateAttributeVariantDto,
  ): Promise<void> {
    return this.attributesService.updateAttributeVariant(
      updateAttributeVariantDto,
    );
  }

  @Delete(ATTRIBUTE_VARIANT_PATH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The attribute variant has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'The attribute variant has not been found',
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'The attribute variant has not been deleted',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  @UsePipes(
    new ParseObjectIdsPipe<IDeleteAttributeValue>(
      ['attributeId', 'variantId'],
      ['string', 'string'],
    ),
  )
  async deleteAttributeVariant(
    @Body() deleteAttributeVariantDto: DeleteAttributeVariantDto,
  ): Promise<void> {
    await this.attributesService.deleteAttributeVariant(
      deleteAttributeVariantDto,
    );
  }
}
