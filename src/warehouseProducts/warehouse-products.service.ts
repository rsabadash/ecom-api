import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkWriteOptions, BulkWriteResult, ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSE_PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  IWarehouseProductCreate,
  INewWarehouseProduct,
  IWarehouseProduct,
  IWarehouseProductAttribute,
  IWarehouseProductVariant,
} from './interfaces/warehouse-products.interfaces';
import { AttributesService } from '../attributes/attributes.service';
import {
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { DropdownListItem } from '../common/interfaces/dropdown-list.interface';
import { Language } from '../common/types/i18n.types';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { DEFAULT_LANGUAGE } from '../common/constants/internationalization.constants';
import { BulkOperations } from '../mongo/types/colection-model.types';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { ERROR } from './constants/message';

@Injectable()
export class WarehouseProductsService {
  constructor(
    @InjectCollectionModel(WAREHOUSE_PRODUCTS_COLLECTION)
    private readonly warehouseProductCollection: ICollectionModel<IWarehouseProduct>,
    private readonly attributesService: AttributesService,
  ) {}

  private getAttributeIds(
    products: IWarehouseProductCreate[],
  ): null | ObjectId[] {
    if (products.length > 0 && products[0].attributes) {
      return products[0].attributes.map(
        (attribute) => new ObjectId(attribute.attributeId),
      );
    }

    return null;
  }

  private async createWarehouseProductsWithAttributes(
    products: IWarehouseProductCreate[],
    attributeIds: ObjectId[],
  ): Promise<IWarehouseProduct[] | null> {
    const currentDate = new Date();

    const attributes = await this.attributesService.getAttributes2(
      {
        _id: { $in: attributeIds },
      },
      { projection: { name: 1, variants: { name: 1, variantId: 1 } } },
    );

    const newProducts = products.reduce<INewWarehouseProduct[]>(
      (acc, product) => {
        const { attributes: warehouseProductAttributes, ...restProductValues } =
          product;

        const productAttributes: IWarehouseProductAttribute[] = [];

        if (
          warehouseProductAttributes &&
          warehouseProductAttributes?.length > 0
        ) {
          warehouseProductAttributes.map((productAttribute) => {
            const foundAttribute = attributes.find(
              (attribute) =>
                attribute._id.toString() === productAttribute.attributeId,
            );

            const productVariants: IWarehouseProductVariant[] = [];

            if (
              foundAttribute &&
              productAttribute.variants &&
              productAttribute.variants?.length > 0
            ) {
              productAttribute.variants.forEach((productVariant) => {
                const foundVariant = foundAttribute.variants.find((variant) => {
                  return (
                    variant.variantId.toString() === productVariant.variantId
                  );
                });

                if (foundVariant) {
                  productVariants?.push({
                    variantId: foundVariant.variantId.toString(),
                    name: foundVariant.name,
                  });
                }
              });

              productAttributes?.push({
                attributeId: foundAttribute._id.toString(),
                name: foundAttribute.name,
                variants: productVariants,
              });
            }
          });
        }

        const updatedProduct: INewWarehouseProduct = {
          ...restProductValues,
          attributes: productAttributes,
          createdAt: currentDate,
          supplyIds: [],
          warehouses: [],
          isDeleted: false,
        };

        acc.push(updatedProduct);

        return acc;
      },
      [],
    );

    return this.warehouseProductCollection.createMany(newProducts);
  }

  async getWarehouseProducts(
    query: PartialEntity<IWarehouseProduct> = {},
    options: FindEntityOptions<IWarehouseProduct> = {},
  ): Promise<PaginationData<IWarehouseProduct>> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<IWarehouseProduct>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.warehouseProductCollection.aggregate<
      PaginationData<IWarehouseProduct>
    >(pipeline);

    return paginatedData[0];
  }

  async getWarehouseProductsDropdownList(
    language: Language,
  ): Promise<DropdownListItem[]> {
    const warehouseProducts = await this.warehouseProductCollection.find();

    return warehouseProducts.map((warehouseProduct) => {
      return {
        id: warehouseProduct._id.toString(),
        value:
          warehouseProduct.name[language] ||
          warehouseProduct.name[DEFAULT_LANGUAGE],
        meta: {
          unit: warehouseProduct.unit,
        },
      };
    });
  }

  private async createWarehouseProductWithoutAttributes(
    products: IWarehouseProductCreate[],
  ): Promise<IWarehouseProduct | null> {
    const product = products[0];
    const currentDate = new Date();

    return this.warehouseProductCollection.create({
      ...product,
      attributes: [],
      createdAt: currentDate,
      warehouses: [],
      supplyIds: [],
      isDeleted: false,
    });
  }

  async createWarehouseProducts(
    createWarehouseProducts: IWarehouseProductCreate[],
  ): Promise<IWarehouseProduct[]> {
    const attributeIds = this.getAttributeIds(createWarehouseProducts);

    if (attributeIds) {
      const newProducts = await this.createWarehouseProductsWithAttributes(
        createWarehouseProducts,
        attributeIds,
      );

      if (!newProducts) {
        throw new BadRequestException(ERROR.WAREHOUSE_PRODUCTS_NOT_CREATED);
      }

      return newProducts;
    }

    const newProduct = await this.createWarehouseProductWithoutAttributes(
      createWarehouseProducts,
    );

    if (!newProduct) {
      throw new BadRequestException(ERROR.WAREHOUSE_PRODUCTS_NOT_CREATED);
    }

    return [newProduct];
  }

  async bulkWrite(
    operations: BulkOperations<IWarehouseProduct>[],
    options: BulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return this.warehouseProductCollection.bulkWrite(operations, options);
  }
}
