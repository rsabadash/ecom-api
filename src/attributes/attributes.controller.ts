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
  Query,
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
import { IAttribute } from './interfaces/attribute.interfaces';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import {
  ATTRIBUTE_ID_PARAM,
  VARIANT_ID_PARAM,
} from './constants/param.constants';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import {
  IVariant,
  IVariantWithAttributeId,
} from './interfaces/variant.interfaces';
import { DeleteVariantDto } from './dto/delete-variant.dto';
import { AttributeDto } from './dto/attribute.dto';
import { VariantDto } from './dto/variant.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { IVariantWithAttribute } from './interfaces/variant-with-attribute.interfaces';
import { MODULE_NAME } from '../common/constants/swagger.constants';
import { ERROR, SWAGGER_DESCRIPTION } from './constants/message.constants';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { PaginationParsedQuery } from '../common/types/query.types';
import { PaginationAttributeDto } from './dto/pagination-attribute.dto';
import { PaginationVariantWithAttributeDto } from './dto/pagination-variant-with-attribute.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(ATTRIBUTES_ROUTE)
@ApiTags(MODULE_NAME.ATTRIBUTES)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_ATTRIBUTES,
    type: [PaginationAttributeDto],
  })
  @ApiNoAccessResponse()
  async getAttributes(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<IAttribute>> {
    const { page, limit } = query;

    return this.attributesService.getAttributes(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(VARIANTS_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_VARIANTS,
    type: [PaginationVariantWithAttributeDto],
  })
  @ApiNoAccessResponse()
  async getVariants(
    @Query(ParsePaginationPipe) query: PaginationParsedQuery,
  ): Promise<PaginationData<IVariantWithAttribute>> {
    const { page, limit } = query;

    return this.attributesService.getVariants(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
  }

  @Get(GET_ATTRIBUTE_BY_ID_PATH)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_ATTRIBUTE,
    type: AttributeDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.ATTRIBUTE_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getAttribute(
    @Param(ATTRIBUTE_ID_PARAM) attributeId: string,
  ): Promise<IAttribute> {
    return this.attributesService.getAttribute({ attributeId });
  }

  @Get(`${GET_ATTRIBUTE_BY_ID_PATH}${VARIANTS_PATH}${GET_VARIANT_BY_ID_PATH}`)
  @ApiOkResponse({
    description: SWAGGER_DESCRIPTION.GET_VARIANT,
    type: VariantDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.VARIANT_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getVariant(
    @Param(ATTRIBUTE_ID_PARAM) attributeId: string,
    @Param(VARIANT_ID_PARAM) variantId: string,
  ): Promise<IVariant> {
    return this.attributesService.getVariant({ attributeId, variantId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_ATTRIBUTE,
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.ATTRIBUTE_NOT_CREATED,
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
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.UPDATE_ATTRIBUTE,
  })
  @ApiNotFoundResponse({
    description: ERROR.ATTRIBUTE_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.ATTRIBUTE_NOT_UPDATED,
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
    description: SWAGGER_DESCRIPTION.DELETE_ATTRIBUTE,
  })
  @ApiNoAccessResponse()
  async deleteAttribute(
    @Body() deleteAttributeDto: DeleteAttributeDto,
  ): Promise<void> {
    await this.attributesService.deleteAttribute(deleteAttributeDto);
  }

  @Post(VARIANTS_PATH)
  @ApiCreatedResponse({
    description: SWAGGER_DESCRIPTION.CREATE_VARIANT,
    type: AttributeDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.VARIANT_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createVariant(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<IVariantWithAttributeId> {
    return this.attributesService.createVariant(createVariantDto);
  }

  @Patch(VARIANTS_PATH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.UPDATE_VARIANT,
  })
  @ApiNotFoundResponse({
    description: ERROR.VARIANT_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiGoneResponse({
    description: ERROR.VARIANT_NOT_UPDATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async updateVariant(
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<void> {
    return this.attributesService.updateVariant(updateVariantDto);
  }

  @Delete(VARIANTS_PATH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SWAGGER_DESCRIPTION.DELETE_VARIANT,
  })
  @ApiNoAccessResponse()
  async deleteVariant(
    @Body() deleteVariantDto: DeleteVariantDto,
  ): Promise<void> {
    await this.attributesService.deleteVariant(deleteVariantDto);
  }
}
