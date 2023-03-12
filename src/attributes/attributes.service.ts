import {
  Injectable,
  NotFoundException,
  BadRequestException,
  GoneException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { ATTRIBUTES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { IAttribute } from './interfaces/attribute.interfaces';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { GetAttributeParameters } from './types/attributes.types';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { DeleteVariantDto } from './dto/delete-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { IVariant } from './interfaces/variant.interfaces';
import { GetVariant } from './types/variant.type';
import { IVariantWithAttribute } from './interfaces/variant-with-attribute.interfaces';
import {
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';

@Injectable()
export class AttributesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<IAttribute>,
  ) {}

  async getAttributes(
    query: PartialEntity<IAttribute> = {},
    options?: FindEntityOptions<IAttribute>,
  ): Promise<IAttribute[]> {
    return await this.attributeCollection.find(query, options);
  }

  async getVariants(): Promise<IVariantWithAttribute[]> {
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
    ];

    return await this.attributeCollection.aggregate<IVariantWithAttribute>(
      pipeline,
    );
  }

  async getAttribute(
    parameters: GetAttributeParameters,
    options: FindEntityOptions<IAttribute> = {},
  ): Promise<IAttribute> {
    const attribute = await this.attributeCollection.findOne(
      {
        _id: parameters.attributeId,
      },
      options,
    );

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    return attribute;
  }

  async getVariant(parameters: GetVariant): Promise<IVariant> {
    const pipeline = [
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
      throw new NotFoundException(
        'The variant of the attribute has not been found',
      );
    }

    return variant;
  }

  async createAttribute(
    createAttributeDto: CreateAttributeDto,
  ): Promise<IAttribute> {
    const newAttribute = await this.attributeCollection.create(
      createAttributeDto,
    );

    if (!newAttribute) {
      throw new BadRequestException('The attribute has not been created');
    }

    return newAttribute;
  }

  async updateAttribute(
    updateAttributesDto: UpdateAttributeDto,
  ): Promise<void> {
    const attribute = await this.getAttribute(
      {
        attributeId: updateAttributesDto.id,
      },
      { projection: { variants: 0 } },
    );

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IAttribute>(
        updateAttributesDto,
        attribute,
      );

    const updateResult = await this.attributeCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isUpdated) {
      throw new BadRequestException('The attribute has not been updated');
    }
  }

  async deleteAttribute(deleteAttributeDto: DeleteAttributeDto): Promise<void> {
    await this.attributeCollection.deleteOne({
      _id: deleteAttributeDto.id,
    });
  }

  async createVariant(
    createAttributeValueDto: CreateVariantDto,
  ): Promise<void> {
    const { attributeId, ...rest } = createAttributeValueDto;

    const variant: IVariant = {
      ...rest,
      variantId: new ObjectId(),
    };

    const updateResult = await this.attributeCollection.updateWithOperator(
      { _id: attributeId },
      {
        $push: {
          variants: variant,
        },
      },
    );

    if (!updateResult.isUpdated) {
      throw new BadRequestException(
        'The variant of the attribute has not been created',
      );
    }
  }

  async updateVariant(
    updateAttributeVariantDto: UpdateVariantDto,
  ): Promise<void> {
    const attribute = await this.attributeCollection.find({
      'variants.variantId': {
        $in: [updateAttributeVariantDto.variantId],
      },
    });

    if (attribute.length === 0) {
      throw new NotFoundException(
        'The variant of the attribute has not been found',
      );
    }

    const variant = attribute[0].variants.find((variant) => {
      return (
        variant.variantId.toString() ===
        updateAttributeVariantDto.variantId.toString()
      );
    });

    const { updatedFields } = this.compareFieldsService.compare<IVariant>(
      updateAttributeVariantDto,
      variant,
    );

    const updateResult = await this.attributeCollection.updateOne(
      {
        'variants.variantId': {
          $in: [updateAttributeVariantDto.variantId],
        },
      },
      { 'variants.$': { ...variant, ...updatedFields } },
    );

    if (!updateResult.isUpdated) {
      throw new GoneException(
        'The variant of the attribute has not been updated',
      );
    }
  }

  async deleteVariant(
    deleteAttributeVariantDto: DeleteVariantDto,
  ): Promise<void> {
    await this.attributeCollection.updateWithOperator(
      {
        'variants.variantId': {
          $in: [deleteAttributeVariantDto.variantId],
        },
      },
      {
        $pull: {
          variants: {
            variantId: deleteAttributeVariantDto.variantId,
          },
        },
      },
    );
  }
}
