import { Injectable, BadRequestException, GoneException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { ATTRIBUTES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  IAttribute,
  IAttributeCreate,
  IAttributeDelete,
  IAttributeUpdate,
  GetAttributeParameters,
} from './interfaces/attribute.interfaces';
import {
  IVariant,
  IVariantCreate,
  IVariantDelete,
  IVariantUpdate,
  GetVariantParameters,
  IVariantWithAttributeId,
} from './interfaces/variant.interfaces';
import { IVariantWithAttribute } from './interfaces/variant-with-attribute.interfaces';
import {
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/message.constants';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { PaginationData } from '../common/interfaces/pagination.interface';

@Injectable()
export class AttributesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<IAttribute>,
  ) {}

  async getAttributes(
    query: PartialEntity<IAttribute> = {},
    options: FindEntityOptions<IAttribute>,
  ): Promise<PaginationData<IAttribute>> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<IAttribute>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.attributeCollection.aggregate<
      PaginationData<IAttribute>
    >(pipeline);

    return paginatedData[0];
  }

  async getAttributes2(
    query: PartialEntity<IAttribute> = {},
    options: FindEntityOptions<IAttribute>,
  ): Promise<IAttribute[]> {
    return await this.attributeCollection.find(query, options);
  }

  async getVariants(
    query: PartialEntity<IVariantWithAttribute> = {},
    options: FindEntityOptions<IVariantWithAttribute>,
  ): Promise<PaginationData<IVariantWithAttribute>> {
    const { skip, limit } = options;

    const paginationPipeline = getPaginationPipeline<IVariantWithAttribute>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    // in current pipeline we have custom "match", so we have to avoid using it here
    const [_match, ...restPipeline] = paginationPipeline;

    const pipeline = [
      { $unwind: '$variants' },
      { $sort: { 'variants.isActive': -1, 'variants.sortOrder': 1 } },
      {
        $project: {
          variants: 1,
          attributeName: '$name',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$variants',
              { attributeName: '$attributeName', attributeId: '$_id' },
            ],
          },
        },
      },
      ...restPipeline,
    ];

    const paginatedData = await this.attributeCollection.aggregate<
      PaginationData<IVariantWithAttribute>
    >(pipeline);

    return paginatedData[0];
  }

  async getAttribute(
    parameters: GetAttributeParameters,
    options: FindEntityOptions<IAttribute> = {},
  ): Promise<IAttribute> {
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

  async getVariant(parameters: GetVariantParameters): Promise<IVariant> {
    const pipeline = [
      { $match: { _id: new ObjectId(parameters.attributeId) } },
      { $unwind: '$variants' },
      {
        $replaceRoot: {
          newRoot: '$variants',
        },
      },
      {
        $match: { variantId: parameters.variantId },
      },
    ];

    const variantDetail = await this.attributeCollection.aggregate<IVariant>(
      pipeline,
    );

    const variant = variantDetail[0];

    if (!variant) {
      throw new EntityNotFoundException(ERROR.VARIANT_NOT_FOUND);
    }

    return variant;
  }

  async createAttribute(
    createAttribute: IAttributeCreate,
  ): Promise<IAttribute> {
    const newAttribute = await this.attributeCollection.create(createAttribute);

    if (!newAttribute) {
      throw new BadRequestException(ERROR.ATTRIBUTE_NOT_CREATED);
    }

    return newAttribute;
  }

  async updateAttribute(updateAttributes: IAttributeUpdate): Promise<void> {
    const attribute = await this.getAttribute(
      {
        attributeId: updateAttributes.id,
      },
      { projection: { variants: 0 } },
    );

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IAttribute>(
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

  async deleteAttribute(deleteAttribute: IAttributeDelete): Promise<void> {
    await this.attributeCollection.deleteOne({
      _id: new ObjectId(deleteAttribute.id),
    });
  }

  async createVariant(
    createVariant: IVariantCreate,
  ): Promise<IVariantWithAttributeId> {
    const { attributeId, ...rest } = createVariant;

    const variant: IVariant = {
      ...rest,
      variantId: new ObjectId().toString(),
    };

    const updateResult = await this.attributeCollection.updateWithOperator(
      { _id: new ObjectId(attributeId) },
      {
        $push: {
          variants: variant,
        },
      },
    );

    if (!updateResult.isUpdated) {
      throw new BadRequestException(ERROR.VARIANT_NOT_CREATED);
    }

    return {
      ...variant,
      attributeId,
    };
  }

  async updateVariant(updateAttributeVariant: IVariantUpdate): Promise<void> {
    const variant = await this.getVariant({
      attributeId: updateAttributeVariant.attributeId,
      variantId: updateAttributeVariant.variantId,
    });

    const { updatedFields } = this.compareFieldsService.compare<IVariant>(
      updateAttributeVariant,
      variant,
    );

    const updateResult = await this.attributeCollection.updateOne(
      {
        _id: new ObjectId(updateAttributeVariant.attributeId),
        'variants.variantId': {
          $in: [updateAttributeVariant.variantId],
        },
      },
      { 'variants.$': { ...variant, ...updatedFields } },
    );

    if (!updateResult.isUpdated) {
      throw new GoneException(ERROR.VARIANT_NOT_UPDATED);
    }
  }

  async deleteVariant(deleteAttributeVariant: IVariantDelete): Promise<void> {
    await this.attributeCollection.updateWithOperator(
      {
        _id: new ObjectId(deleteAttributeVariant.attributeId),
        'variants.variantId': {
          $in: [deleteAttributeVariant.variantId],
        },
      },
      {
        $pull: {
          variants: {
            variantId: deleteAttributeVariant.variantId,
          },
        },
      },
    );
  }
}
