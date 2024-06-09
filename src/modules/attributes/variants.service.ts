import { Injectable, BadRequestException, GoneException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CompareFieldsService } from '../../common/services/compare-fields.service';
import { InjectCollectionModel } from '../../mongo/decorators/mongo.decorators';
import { ATTRIBUTES_COLLECTION } from '../../common/constants/collections.constants';
import { ICollectionModel } from '../../mongo/interfaces/colection-model.interfaces';
import { AttributeEntity } from './interfaces/attribute.interface';
import {
  IVariant,
  GetVariantParameters,
  VariantEntity,
  CreateVariant,
  UpdateVariant,
  DeleteVariant,
} from './interfaces/variant.interface';
import { FindEntityOptions } from '../../mongo/types/mongo-query.types';
import { EntityNotFoundException } from '../../common/exeptions/entity-not-found.exception';
import { ERROR } from './constants/swagger.constants';
import { getPaginationPipeline } from '../../common/utils/getPaginationPipeline';
import {
  CreateVariantResponse,
  GetVariantResponse,
  GetVariantsResponse,
} from './interfaces/response.interface';

@Injectable()
export class VariantsService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<AttributeEntity>,
  ) {}

  async getVariants(
    query: Record<string, string> = {},
    options: FindEntityOptions<VariantEntity>,
  ): Promise<GetVariantsResponse> {
    const { skip, limit } = options;

    const paginationPipeline = getPaginationPipeline<VariantEntity>({
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
      { $sort: { 'variants.isActive': -1 } },
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

    const paginatedData =
      await this.attributeCollection.aggregate<GetVariantsResponse>(pipeline);

    return paginatedData[0];
  }

  async getVariant(
    parameters: GetVariantParameters,
  ): Promise<GetVariantResponse> {
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

  async createVariant(
    createVariant: CreateVariant,
  ): Promise<CreateVariantResponse> {
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

  async updateVariant(updateAttributeVariant: UpdateVariant): Promise<void> {
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

  async deleteVariant(deleteAttributeVariant: DeleteVariant): Promise<void> {
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