import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkWriteOptions, BulkWriteResult, ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSE_PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  ICreateWarehouseProduct,
  INewWarehouseProduct,
  IWarehouseProduct,
  IWarehouseProductAttribute,
  IWarehouseProductVariant,
} from './interfaces/warehouse-products.interfaces';
import { CreateWarehouseProductDto } from './dto/create-warehouse-product.dto';
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

@Injectable()
export class WarehouseProductsService {
  constructor(
    @InjectCollectionModel(WAREHOUSE_PRODUCTS_COLLECTION)
    private readonly warehouseProductCollection: ICollectionModel<IWarehouseProduct>,
    private readonly attributesService: AttributesService,
  ) {}

  private getAttributeIds(
    products: ICreateWarehouseProduct[],
  ): null | ObjectId[] {
    if (products.length > 0 && products[0].attributes) {
      return products[0].attributes.map(
        (attribute) => new ObjectId(attribute.attributeId),
      );
    }

    return null;
  }

  private async createWarehouseProductsWithAttributes(
    products: ICreateWarehouseProduct[],
    attributeIds: ObjectId[],
  ): Promise<IWarehouseProduct[] | null> {
    const currentDate = new Date();

    const attributes = await this.attributesService.getAttributes(
      {
        _id: { $in: attributeIds },
      },
      { projection: { name: 1, variants: { name: 1, variantId: 1 } } },
    );

    const newProducts = products.reduce<INewWarehouseProduct[]>(
      (acc, product) => {
        const {
          attributes: warehouseProductAttributes,
          groupName,
          ...restProductValues
        } = product;

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
          groupName: groupName ? groupName : null,
          groupId: groupName ? new ObjectId() : null,
          attributes: productAttributes,
          createdDate: currentDate,
          supplyIds: [],
          warehouses: [],
        };

        acc.push(updatedProduct);

        return acc;
      },
      [],
    );

    return await this.warehouseProductCollection.createMany(newProducts);
  }

  async getWarehouseProducts(
    query: PartialEntity<IWarehouseProduct> = {},
    options: FindEntityOptions<IWarehouseProduct> = {},
  ): Promise<PaginationData<IWarehouseProduct>> {
    const { skip, limit } = options;

    const paginatedData = await this.warehouseProductCollection.aggregate<
      PaginationData<IWarehouseProduct>
    >([
      { $match: query },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          data: 1,
          metadata: { total: { $arrayElemAt: ['$total.count', 0] } },
        },
      },
    ]);

    return paginatedData[0];
  }

  async getWarehouseProducts2(
    query: PartialEntity<IWarehouseProduct> = {},
  ): Promise<IWarehouseProduct[]> {
    return await this.warehouseProductCollection.find(query);
  }

  async getWarehouseProductsDropdownList(
    language: Language,
  ): Promise<DropdownListItem[]> {
    const warehouseProducts = await this.getWarehouseProducts2();

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
    products: ICreateWarehouseProduct[],
  ): Promise<IWarehouseProduct | null> {
    const product = products[0];
    const currentDate = new Date();
    const { groupName } = product;

    return await this.warehouseProductCollection.create({
      ...product,
      attributes: null,
      groupName: groupName ? groupName : null,
      groupId: groupName ? new ObjectId() : null,
      createdDate: currentDate,
      warehouses: [],
      supplyIds: [],
    });
  }

  async createWarehouseProducts(
    createWarehouseProductsDto: CreateWarehouseProductDto[],
  ): Promise<IWarehouseProduct[] | null> {
    const attributeIds = this.getAttributeIds(createWarehouseProductsDto);

    if (attributeIds) {
      const newProducts = await this.createWarehouseProductsWithAttributes(
        createWarehouseProductsDto,
        attributeIds,
      );

      if (!newProducts) {
        throw new BadRequestException(
          'Warehouse products have not been created',
        );
      }

      return newProducts;
    }

    const newProduct = await this.createWarehouseProductWithoutAttributes(
      createWarehouseProductsDto,
    );

    if (!newProduct) {
      throw new BadRequestException('Warehouse products have not been created');
    }

    return [newProduct];
  }

  async bulkWrite(
    operations: BulkOperations<IWarehouseProduct>[],
    options: BulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return await this.warehouseProductCollection.bulkWrite(operations, options);
  }
}
