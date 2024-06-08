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
import { CreateAttributeDto } from './dto/request/create-attribute.dto';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import {
  ATTRIBUTE_ID_PARAM,
  VARIANT_ID_PARAM,
} from './constants/param.constants';
import { DeleteAttributeDto } from './dto/request/delete-attribute.dto';
import { UpdateAttributeDto } from './dto/request/update-attribute.dto';
import { UpdateVariantDto } from './dto/request/update-variant.dto';
import { CreateVariantDto } from './dto/request/create-variant.dto';
import { DeleteVariantDto } from './dto/request/delete-variant.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import { GetAttributesResponseDto } from './dto/response/get-attributes-response.dto';
import {
  GetAttributesQuery,
  GetVariantsQuery,
} from './interfaces/query.interface';
import {
  CreateAttributeResponse,
  CreateVariantResponse,
  GetAttributeResponse,
  GetAttributesResponse,
  GetVariantResponse,
  GetVariantsResponse,
} from './interfaces/response.interface';
import { GetVariantsResponseDto } from './dto/response/get-variants-response.dto';
import { GetAttributeResponseDto } from './dto/response/get-attribute-response.dto';
import { GetVariantResponseDto } from './dto/response/get-variant-response.dto';
import { CreateAttributeResponseDto } from './dto/response/create-attribute-response.dto';
import { CreateVariantResponseDto } from './dto/response/create-variant-response.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(ATTRIBUTES_ROUTE)
@ApiTags(MODULE_NAME)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOkResponse({
    description: SUCCESS.GET_ATTRIBUTES,
    type: GetAttributesResponseDto,
  })
  @ApiNoAccessResponse()
  async getAttributes(
    @Query(ParsePaginationPipe) query: GetAttributesQuery,
  ): Promise<GetAttributesResponse> {
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
    description: SUCCESS.GET_VARIANTS,
    type: GetVariantsResponseDto,
  })
  @ApiNoAccessResponse()
  async getVariants(
    @Query(ParsePaginationPipe) query: GetVariantsQuery,
  ): Promise<GetVariantsResponse> {
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
    description: SUCCESS.GET_ATTRIBUTE,
    type: GetAttributeResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.ATTRIBUTE_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getAttribute(
    @Param(ATTRIBUTE_ID_PARAM) attributeId: string,
  ): Promise<GetAttributeResponse> {
    return this.attributesService.getAttribute({ attributeId });
  }

  @Get(`${GET_ATTRIBUTE_BY_ID_PATH}${VARIANTS_PATH}${GET_VARIANT_BY_ID_PATH}`)
  @ApiOkResponse({
    description: SUCCESS.GET_VARIANT,
    type: GetVariantResponseDto,
  })
  @ApiNotFoundResponse({
    description: ERROR.VARIANT_NOT_FOUND,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async getVariant(
    @Param(ATTRIBUTE_ID_PARAM) attributeId: string,
    @Param(VARIANT_ID_PARAM) variantId: string,
  ): Promise<GetVariantResponse> {
    return this.attributesService.getVariant({ attributeId, variantId });
  }

  @Post()
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_ATTRIBUTE,
    type: CreateAttributeResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.ATTRIBUTE_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createAttribute(
    @Body() createAttributeDto: CreateAttributeDto,
  ): Promise<CreateAttributeResponse> {
    return this.attributesService.createAttribute(createAttributeDto);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_ATTRIBUTE,
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
    description: SUCCESS.DELETE_ATTRIBUTE,
  })
  @ApiNoAccessResponse()
  async deleteAttribute(
    @Body() deleteAttributeDto: DeleteAttributeDto,
  ): Promise<void> {
    await this.attributesService.deleteAttribute(deleteAttributeDto);
  }

  @Post(VARIANTS_PATH)
  @ApiCreatedResponse({
    description: SUCCESS.CREATE_VARIANT,
    type: CreateVariantResponseDto,
  })
  @ApiBadRequestResponse({
    description: ERROR.VARIANT_NOT_CREATED,
    type: HttpErrorDto,
  })
  @ApiNoAccessResponse()
  async createVariant(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<CreateVariantResponse> {
    return this.attributesService.createVariant(createVariantDto);
  }

  @Patch(VARIANTS_PATH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: SUCCESS.UPDATE_VARIANT,
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
    description: SUCCESS.DELETE_VARIANT,
  })
  @ApiNoAccessResponse()
  async deleteVariant(
    @Body() deleteVariantDto: DeleteVariantDto,
  ): Promise<void> {
    await this.attributesService.deleteVariant(deleteVariantDto);
  }
}
