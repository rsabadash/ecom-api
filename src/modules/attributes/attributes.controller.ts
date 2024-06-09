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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ATTRIBUTES_ROUTE,
  GET_ATTRIBUTE_BY_ID_PATH,
} from './constants/route.constants';
import { Auth } from '../iam/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/request/create-attribute.dto';
import { ApiNoAccessResponse } from '../../common/decorators/swagger/api-no-access-response.decorator';
import { HttpErrorDto } from '../../common/dto/response/http-error.dto';
import { ATTRIBUTE_ID_PARAM } from './constants/param.constants';
import { DeleteAttributeDto } from './dto/request/delete-attribute.dto';
import { UpdateAttributeDto } from './dto/request/update-attribute.dto';
import { Roles } from '../iam/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ERROR, SUCCESS, MODULE_NAME } from './constants/swagger.constants';
import { ParsePaginationPipe } from '../../common/pipes/parse-pagination.pipe';
import { GetAttributesResponseDto } from './dto/response/get-attributes-response.dto';
import {
  CreateAttributeResponse,
  GetAttributeResponse,
  GetAttributesResponse,
} from './interfaces/response.interface';
import { GetAttributeResponseDto } from './dto/response/get-attribute-response.dto';
import { CreateAttributeResponseDto } from './dto/response/create-attribute-response.dto';
import { GetAttributesQueryDto } from './dto/request/get-attributes-query.dto';

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
    @Query(ParsePaginationPipe) query: GetAttributesQueryDto,
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
}
