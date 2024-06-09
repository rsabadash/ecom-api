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
import { VariantsService } from './variants.service';
import { ApiNoAccessResponse } from '../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';
import {
  ATTRIBUTE_ID_PARAM,
  VARIANT_ID_PARAM,
} from './constants/param.constants';
import { UpdateVariantDto } from './dto/request/update-variant.dto';
import { CreateVariantDto } from './dto/request/create-variant.dto';
import { DeleteVariantDto } from './dto/request/delete-variant.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { ParsePaginationPipe } from '../common/pipes/parse-pagination.pipe';
import {
  CreateVariantResponse,
  GetVariantResponse,
  GetVariantsResponse,
} from './interfaces/response.interface';
import { GetVariantsResponseDto } from './dto/response/get-variants-response.dto';
import { GetVariantResponseDto } from './dto/response/get-variant-response.dto';
import { CreateVariantResponseDto } from './dto/response/create-variant-response.dto';
import { GetVariantsQueryDto } from './dto/request/get-variants-query.dto';

@Roles(Role.Admin)
@Auth(AuthType.Bearer)
@Controller(ATTRIBUTES_ROUTE)
@ApiTags(MODULE_NAME)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get(VARIANTS_PATH)
  @ApiOkResponse({
    description: SUCCESS.GET_VARIANTS,
    type: GetVariantsResponseDto,
  })
  @ApiNoAccessResponse()
  async getVariants(
    @Query(ParsePaginationPipe) query: GetVariantsQueryDto,
  ): Promise<GetVariantsResponse> {
    const { page, limit } = query;

    return this.variantsService.getVariants(
      {},
      {
        skip: page,
        limit: limit,
      },
    );
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
    return this.variantsService.getVariant({ attributeId, variantId });
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
    return this.variantsService.createVariant(createVariantDto);
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
    return this.variantsService.updateVariant(updateVariantDto);
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
    await this.variantsService.deleteVariant(deleteVariantDto);
  }
}
