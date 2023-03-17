import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { WAREHOUSE_PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  ICreateWarehouseProduct,
  INewWarehouseProduct,
  IWarehouseProduct,
} from './interfaces/warehouse-products.interfaces';
import { CreateWarehouseProductDto } from './dto/create-warehouse-product.dto';
import { AttributesService } from '../attributes/attributes.service';
import { PartialEntity } from '../mongo/types/mongo-query.types';

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

        const productAttributes = warehouseProductAttributes.map(
          (productAttribute) => {
            const foundAttribute = attributes.find(
              (attribute) =>
                attribute._id.toString() ===
                productAttribute.attributeId.toString(),
            );

            const productVariants = productAttribute.variants.map(
              (productVariant) => {
                const foundVariant = foundAttribute.variants.find((variant) => {
                  return (
                    variant.variantId.toString() ===
                    productVariant.variantId.toString()
                  );
                });

                return {
                  variantId: foundVariant.variantId.toString(),
                  name: foundVariant.name,
                };
              },
            );

            return {
              attributeId: foundAttribute._id.toString(),
              name: foundAttribute.name,
              variants: productVariants,
            };
          },
        );

        const updatedProduct: INewWarehouseProduct = {
          ...restProductValues,
          groupName: groupName ? groupName : null,
          groupId: groupName ? new ObjectId() : null,
          attributes: productAttributes,
          createdDate: currentDate,
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
  ): Promise<IWarehouseProduct[]> {
    return await this.warehouseProductCollection.find(query);
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
}
