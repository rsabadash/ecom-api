import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import {
  InjectClients,
  InjectCollectionModel,
} from '../mongo/decorators/mongo.decorators';
import { ATTRIBUTES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import { IAttribute } from './interfaces/attribute.interfaces';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { GetAttributeParameters } from './types/attributes.types';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeVariantDto } from './dto/create-attribute-variant.dto';
import { MongoClient, ObjectId } from 'mongodb';
import { UpdateAttributeVariantDto } from './dto/update-attribute-variant.dto';
import { DeleteAttributeVariantDto } from './dto/delete-attribute-variant.dto';
import { IAttributeVariant } from './interfaces/attribute-variant.interfaces';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import { ClientsMap } from '../mongo/types/mongo-query.types';

@Injectable()
export class AttributesService {
  private client: MongoClient;
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(ATTRIBUTES_COLLECTION)
    private readonly attributeCollection: ICollectionModel<IAttribute>,
    @InjectClients(CONNECTION_DB_NAME)
    private readonly clients: ClientsMap,
  ) {
    this.client = this.clients.get(CONNECTION_DB_NAME);
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

  async getAttributes(): Promise<IAttribute[]> {
    return await this.attributeCollection.find();
  }

  async getAttribute(
    parameters: GetAttributeParameters,
    options = {},
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

  async updateAttribute(
    updateAttributesDto: UpdateAttributeDto,
  ): Promise<void> {
    const attribute = await this.getAttribute(
      {
        attributeId: updateAttributesDto.id,
      },
      { projection: { variants: 0 } },
    );

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IAttribute>(
        updateAttributesDto,
        attribute,
      );

    const updateResult = await this.attributeCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isFound) {
      throw new BadRequestException('The attribute has not been updated');
    }
  }

  async deleteAttribute(deleteAttributeDto: DeleteAttributeDto): Promise<void> {
    const attribute = await this.getAttribute({
      attributeId: deleteAttributeDto.id,
    });

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    const deleteResult = await this.attributeCollection.deleteOne({
      _id: deleteAttributeDto.id,
    });

    if (!deleteResult.isDeleted) {
      throw new BadRequestException('The attribute has not been deleted');
    }
  }

  //Attribute variant

  async createAttributeVariant(
    createAttributeValueDto: CreateAttributeVariantDto,
  ): Promise<void> {
    const attribute = await this.getAttribute({
      attributeId: createAttributeValueDto.attributeId,
    });

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    const attributeVariant = {
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

    if (!updateResult.isFound) {
      throw new BadRequestException(
        'The attribute variant has not been created',
      );
    }
  }

  async getAttributeVariant(
    getAttributesVariantDto,
  ): Promise<IAttributeVariant[]> {
    const attribute = await this.getAttribute({
      attributeId: getAttributesVariantDto.attributeId,
    });

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    const pipeline = [
      { $unwind: '$variants' },
      { $project: { _id: 0, variants: 1 } },
      {
        $replaceRoot: {
          newRoot: '$variants',
        },
      },
      {
        $match: { variantId: getAttributesVariantDto.variantId },
      },
    ];

    return await this.attributeCollection.aggregate(pipeline);
  }

  async getAttributesVariants(): Promise<IAttributeVariant[]> {
    const pipeline = [
      { $unwind: '$variants' },
      { $project: { _id: 0, variants: 1 } },
      { $sort: { 'variants.isActive': -1 } },
      {
        $replaceRoot: {
          newRoot: '$variants',
        },
      },
    ];

    //what we should return if there are no variants exist?

    return await this.attributeCollection.aggregate(pipeline);
  }

  async updateAttributeVariant(
    updateAttributeVariantDto: UpdateAttributeVariantDto,
  ): Promise<void> {
    const attribute = await this.getAttribute({
      attributeId: updateAttributeVariantDto.attributeId,
    });

    if (!attribute) {
      throw new NotFoundException('The attribute has not been found');
    }

    const updateResult = await this.attributeCollection.updateOne(
      {
        _id: updateAttributeVariantDto.attributeId,
        variants: {
          $elemMatch: { variantId: updateAttributeVariantDto.variantId },
        },
      },
      { 'variants.$': updateAttributeVariantDto },
    );

    if (!updateResult.isFound) {
      throw new BadRequestException(
        'The attribute variant has not been updated',
      );
    }
  }

  async deleteAttributeVariant(
    deleteAttributeVariantDto: DeleteAttributeVariantDto,
  ): Promise<void> {
    const attribute = await this.getAttribute({
      attributeId: deleteAttributeVariantDto.attributeId,
    });

    if (!attribute) {
      throw new NotFoundException('The attribute variant has not been found');
    }

    const session = this.client.startSession();

    try {
      const updateResult = await this.attributeCollection.updateWithOperator(
        {
          _id: deleteAttributeVariantDto.attributeId,
        },
        {
          $pull: {
            variants: {
              variantId: deleteAttributeVariantDto.variantId,
            },
          },
        },
      );

      if (!updateResult.isFound) {
        throw new BadRequestException(
          'The attribute variant has not been deleted',
        );
      }
    } finally {
      await session.endSession();
    }
  }
}
