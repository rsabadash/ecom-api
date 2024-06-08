import { Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { ATTRIBUTES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  GetAttributeParameters,
  AttributeEntity,
  CreateAttribute,
  UpdateAttribute,
  DeleteAttribute,
} from './interfaces/attribute.interface';
import {
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/swagger.constants';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { PaginationData } from '../common/interfaces/pagination.interface';
import {
  CreateAttributeResponse,
  GetAttributeResponse,
  GetAttributesResponse,
} from './interfaces/response.interface';

@Injectable()
export class AttributesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<AttributeEntity>,
  ) {}

  async getAttributes(
    query: Record<string, string> = {},
    options: FindEntityOptions<AttributeEntity> = {},
  ): Promise<GetAttributesResponse> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<AttributeEntity>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.attributeCollection.aggregate<
      PaginationData<AttributeEntity>
    >(pipeline);

    return paginatedData[0];
  }

  // TODO Unify for attribute and product controller
  async getAttributes2(
    query: PartialEntity<AttributeEntity> = {},
    options: FindEntityOptions<AttributeEntity>,
  ): Promise<AttributeEntity[]> {
    return this.attributeCollection.find(query, options);
  }

  async getAttribute(
    parameters: GetAttributeParameters,
    options: FindEntityOptions<AttributeEntity> = {},
  ): Promise<GetAttributeResponse> {
    const attribute = await this.attributeCollection.findOne(
      {
        _id: new ObjectId(parameters.attributeId),
      },
      options,
    );
    if (!attribute) {
      throw new EntityNotFoundException(ERROR.ATTRIBUTE_NOT_FOUND);
    }

    return attribute;
  }

  async createAttribute(
    createAttribute: CreateAttribute,
  ): Promise<CreateAttributeResponse> {
    const newAttribute = await this.attributeCollection.create(createAttribute);

    if (!newAttribute) {
      throw new BadRequestException(ERROR.ATTRIBUTE_NOT_CREATED);
    }

    return newAttribute;
  }

  async updateAttribute(updateAttributes: UpdateAttribute): Promise<void> {
    const attribute = await this.getAttribute(
      {
        attributeId: updateAttributes.id,
      },
      { projection: { variants: 0 } },
    );

    const { _id, updatedFields } =
      this.compareFieldsService.compare<AttributeEntity>(
        updateAttributes,
        attribute,
      );

    const updatedResult = await this.attributeCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updatedResult.isUpdated) {
      throw new BadRequestException(ERROR.ATTRIBUTE_NOT_UPDATED);
    }
  }

  async deleteAttribute(deleteAttribute: DeleteAttribute): Promise<void> {
    await this.attributeCollection.deleteOne({
      _id: new ObjectId(deleteAttribute.id),
    });
  }
}
