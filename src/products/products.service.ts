import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkWriteOptions, BulkWriteResult, ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  IProductCreate,
  INewProduct,
  IProduct,
  IProductAttribute,
  IProductVariant,
} from './interfaces/products.interfaces';
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
export class ProductsService {
  constructor(
    @InjectCollectionModel(PRODUCTS_COLLECTION)
    private readonly productCollection: ICollectionModel<IProduct>,
    private readonly attributesService: AttributesService,
  ) {}

  private getAttributeIds(
    products: IProductCreate[],
  ): null | ObjectId[] {
    if (products.length > 0 && products[0].attributes) {
      return products[0].attributes.map(
        (attribute) => new ObjectId(attribute.attributeId),
      );
    }

    return null;
  }

  private async createProductsWithAttributes(
    products: IProductCreate[],
    attributeIds: ObjectId[],
  ): Promise<IProduct[] | null> {
    const currentDate = new Date();

    const attributes = await this.attributesService.getAttributes2(
      {
        _id: { $in: attributeIds },
      },
      { projection: { name: 1, variants: { name: 1, variantId: 1 } } },
    );

    const newProducts = products.reduce<INewProduct[]>(
      (acc, product) => {
        const { attributes: newProductAttributes, ...restProductValues } =
          product;

        const productAttributes: IProductAttribute[] = [];

        if (
          newProductAttributes &&
          newProductAttributes?.length > 0
        ) {
          newProductAttributes.map((productAttribute) => {
            const foundAttribute = attributes.find(
              (attribute) =>
                attribute._id.toString() === productAttribute.attributeId,
            );

            const productVariants: IProductVariant[] = [];

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

        const updatedProduct: INewProduct = {
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

    return this.productCollection.createMany(newProducts);
  }

  async getProducts(
    query: PartialEntity<IProduct> = {},
    options: FindEntityOptions<IProduct> = {},
  ): Promise<PaginationData<IProduct>> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<IProduct>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.productCollection.aggregate<
      PaginationData<IProduct>
    >(pipeline);

    return paginatedData[0];
  }

  async getProductsDropdownList(): Promise<DropdownListItem[]> {
    const products = await this.productCollection.find();

    return products.map((product) => {
      return {
        id: product._id.toString(),
        value: product.name,
        meta: {
          unit: product.unit,
        },
      };
    });
  }

  private async createProductWithoutAttributes(
    products: IProductCreate[],
  ): Promise<IProduct | null> {
    const product = products[0];
    const currentDate = new Date();

    return this.productCollection.create({
      ...product,
      attributes: [],
      createdAt: currentDate,
      warehouses: [],
      supplyIds: [],
      isDeleted: false,
    });
  }

  async createProducts(
    createProducts: IProductCreate[],
  ): Promise<IProduct[]> {
    const attributeIds = this.getAttributeIds(createProducts);

    if (attributeIds) {
      const newProducts = await this.createProductsWithAttributes(
        createProducts,
        attributeIds,
      );

      if (!newProducts) {
        throw new BadRequestException(ERROR.PRODUCTS_NOT_CREATED);
      }

      return newProducts;
    }

    const newProduct = await this.createProductWithoutAttributes(
      createProducts,
    );

    if (!newProduct) {
      throw new BadRequestException(ERROR.PRODUCTS_NOT_CREATED);
    }

    return [newProduct];
  }

  async bulkWrite(
    operations: BulkOperations<IProduct>[],
    options: BulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return this.productCollection.bulkWrite(operations, options);
  }
}
