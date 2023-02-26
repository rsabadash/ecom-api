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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {
  ATTRIBUTES_ROUTE,
  GET_ATTRIBUTE_BY_ID_PATH,
  VARIANTS_PATH,
  GET_VARIANT_BY_ID_PATH,
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
import { HttpErrorDto } from '../common/dto/swagger/http-error.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectId.pipe';
import {
  ATTRIBUTE_ID_PARAM,
  VARIANT_ID_PARAM,
} from './constants/param.constants';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { ParseObjectIdsPipe } from '../common/pipes/parse-body-objectId.pipe';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ICreateVariant, IVariant } from './interfaces/variant.interfaces';
import { DeleteVariantDto } from './dto/delete-variant.dto';
import { AttributeDto } from './dto/attribute.dto';
import { VariantDto } from './dto/variant.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enums';
import { ATTRIBUTES_MODULE_NAME } from './constants/swagger.constants';
import { IVariantWithAttribute } from './interfaces/variant-with-attribute.interfaces';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(ATTRIBUTES_ROUTE)
@ApiTags(ATTRIBUTES_MODULE_NAME)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of attributes were retrieved',
    type: [AttributeDto],
  })
  @ApiNoAccessResponse()
  async getAttributes(): Promise<IAttribute[]> {
    return await this.attributesService.getAttributes();
  }

  @Get(VARIANTS_PATH)
  @ApiOkResponse({
    description: 'List of variants were of attributes retrieved',
    type: [VariantDto],
  })
  @ApiNoAccessResponse()
  async getAttributesVariants(): Promise<IVariantWithAttribute[]> {
    return await this.attributesService.getVariants();
  }

  @Get(GET_ATTRIBUTE_BY_ID_PATH)
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
    @Param(ATTRIBUTE_ID_PARAM, ParseObjectIdPipe) attributeId: ObjectId,
  ): Promise<IAttribute> {
    return await this.attributesService.getAttribute({ attributeId });
  }

  @Get(`${VARIANTS_PATH}${GET_VARIANT_BY_ID_PATH}`)
  @ApiOkResponse({
    description: 'The variant of the attribute was retrieved',
    type: VariantDto,
  })
  @ApiNotFoundResponse({
    description: 'The variant of the attribute has not been found',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getAttributeVariant(
    @Param(VARIANT_ID_PARAM, ParseObjectIdPipe) variantId: ObjectId,
  ): Promise<IVariant> {
    return await this.attributesService.getVariant({ variantId });
  }

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

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ParseObjectIdsPipe<IUpdateAttribute>('id', 'string'))
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
  @UsePipes(new ParseObjectIdsPipe<IDeleteAttribute>('id', 'string'))
  @ApiNoContentResponse({
    description: 'The attribute has been deleted',
  })
  @ApiNoAccessResponse()
  async deleteAttribute(
    @Body() deleteAttributeDto: DeleteAttributeDto,
  ): Promise<void> {
    await this.attributesService.deleteAttribute(deleteAttributeDto);
  }

  @Post(VARIANTS_PATH)
  @UsePipes(new ParseObjectIdsPipe<ICreateVariant>('attributeId', 'string'))
  @ApiCreatedResponse({
    description: 'The variant of the attribute has been created',
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: 'The variant of the attribute has not been created',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createAttributeVariant(
    @Body() createValueDto: CreateVariantDto,
  ): Promise<void> {
    return this.attributesService.createVariant(createValueDto);
  }

  @Patch(VARIANTS_PATH)
  @UsePipes(new ParseObjectIdsPipe<IVariant>('variantId', 'string'))
  @ApiCreatedResponse({
    description: 'The variant of the attribute has been updated',
    type: AttributeDto,
  })
  @ApiNotFoundResponse({
    description: 'The variant of the attribute has not been found',
    type: HttpErrorDto,
  })
  @ApiGoneResponse({
    description: 'The variant of the attribute has not been updated',
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateAttributeVariant(
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<void> {
    return this.attributesService.updateVariant(updateVariantDto);
  }

  @Delete(VARIANTS_PATH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ParseObjectIdsPipe<IVariant>('variantId', 'string'))
  @ApiNoContentResponse({
    description: 'The variant of the attribute has been deleted',
  })
  @ApiNoAccessResponse()
  async deleteAttributeVariant(
    @Body() deleteVariantDto: DeleteVariantDto,
  ): Promise<void> {
    await this.attributesService.deleteVariant(deleteVariantDto);
  }
}
