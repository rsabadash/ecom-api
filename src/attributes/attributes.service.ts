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
import { CreateAttributeVariantDto } from './dto/create-attribute-variant.dto';
import { UpdateAttributeVariantDto } from './dto/update-attribute-variant.dto';
import { DeleteAttributeVariantDto } from './dto/delete-attribute-variant.dto';
import { IAttributeVariant } from './interfaces/attribute-variant.interfaces';
import { FindEntityOptions } from '../mongo/types/mongo-query.types';
import { GetAttributeVariant } from './types/attribute-variant.type';

@Injectable()
export class AttributesService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<IAttribute>,
  ) {}

  async getAttributes(): Promise<IAttribute[]> {
    return await this.attributeCollection.find();
  }

  async getAttributesVariants(): Promise<IAttributeVariant[]> {
    const pipeline = [
      { $unwind: '$variants' },
      { $project: { variants: 1 } },
      { $sort: { 'variants.isActive': -1 } },
      {
        $replaceRoot: {
          newRoot: '$variants',
        },
      },
    ];

    return await this.attributeCollection.aggregate<IAttributeVariant>(
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

  async getAttributeVariant(
    parameters: GetAttributeVariant,
  ): Promise<IAttributeVariant> {
    const pipeline = [
      { $unwind: '$variants' },
      { $project: { _id: 0, variants: 1 } },
      {
        $replaceRoot: {
          newRoot: '$variants',
        },
      },
      {
        $match: { variantId: parameters.variantId },
      },
    ];

    const variantDetail =
      await this.attributeCollection.aggregate<IAttributeVariant>(pipeline);

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

  async createAttributeVariant(
    createAttributeValueDto: CreateAttributeVariantDto,
  ): Promise<void> {
    const attributeVariant: IAttributeVariant = {
      ...createAttributeValueDto,
      variantId: new ObjectId(),
    };

    const updateResult = await this.attributeCollection.updateWithOperator(
      { _id: createAttributeValueDto.attributeId },
      {
        $push: {
          variants: attributeVariant,
        },
      },
    );

    if (!updateResult.isUpdated) {
      throw new BadRequestException(
        'The variant of the attribute has not been created',
      );
    }
  }

  async updateAttributeVariant(
    updateAttributeVariantDto: UpdateAttributeVariantDto,
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

    const { updatedFields } =
      this.compareFieldsService.compare<IAttributeVariant>(
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

  async deleteAttributeVariant(
    deleteAttributeVariantDto: DeleteAttributeVariantDto,
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