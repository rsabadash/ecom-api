import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkWriteOptions, BulkWriteResult, ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { PRODUCTS_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  NewProduct,
  ProductEntity,
  ProductAttribute,
  ProductVariant,
  CreateProduct,
} from './interfaces/product.interfaces';
import { AttributesService } from '../attributes/attributes.service';
import {
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { BulkOperations } from '../mongo/types/colection-model.types';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { ERROR } from './constants/swagger.constants';
import {
  CreateProductsResponse,
  GetProductsResponse,
  ProductDropdownListItem,
} from './interfaces/response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectCollectionModel(PRODUCTS_COLLECTION)
    private readonly productCollection: ICollectionModel<ProductEntity>,
    private readonly attributesService: AttributesService,
  ) {}

  private getAttributeIds(products: CreateProduct[]): null | ObjectId[] {
    if (products.length > 0 && products[0].attributes) {
      return products[0].attributes.map(
        (attribute) => new ObjectId(attribute.attributeId),
      );
    }

    return null;
  }

  async getProducts(
    query: PartialEntity<ProductEntity> = {},
    options: FindEntityOptions<ProductEntity> = {},
  ): Promise<GetProductsResponse> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline<ProductEntity>({
      query,
      filter: {
        skip,
        limit,
      },
    });

    // _id typed as string, but actual type is ObjectId
    const paginatedData =
      await this.productCollection.aggregate<GetProductsResponse>(pipeline);

    return paginatedData[0];
  }

  async getProductsDropdownList(): Promise<ProductDropdownListItem[]> {
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

  private async createProductsWithAttributes(
    products: CreateProduct[],
    attributeIds: ObjectId[],
  ): Promise<ProductEntity[] | null> {
    const currentDate = new Date();

    const attributes = await this.attributesService.getAttributes2(
      {
        _id: { $in: attributeIds },
      },
      { projection: { name: 1, variants: { name: 1, variantId: 1 } } },
    );

    const newProducts = products.reduce<NewProduct[]>((acc, product) => {
      const { attributes: newProductAttributes, ...restProductValues } =
        product;

      const productAttributes: ProductAttribute[] = [];

      if (newProductAttributes && newProductAttributes?.length > 0) {
        newProductAttributes.map((productAttribute) => {
          const foundAttribute = attributes.find(
            (attribute) =>
              attribute._id.toString() === productAttribute.attributeId,
          );

          const productVariants: ProductVariant[] = [];

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

      const updatedProduct: NewProduct = {
        ...restProductValues,
        attributes: productAttributes,
        createdAt: currentDate,
        supplyIds: [],
        warehouses: [],
        isDeleted: false,
      };

      acc.push(updatedProduct);

      return acc;
    }, []);

    return this.productCollection.createMany(newProducts);
  }

  private async createProductWithoutAttributes(
    products: CreateProduct[],
  ): Promise<ProductEntity | null> {
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
    createProducts: CreateProduct[],
  ): Promise<CreateProductsResponse[]> {
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
    operations: BulkOperations<ProductEntity>[],
    options: BulkWriteOptions,
  ): Promise<BulkWriteResult> {
    return this.productCollection.bulkWrite(operations, options);
  }
}
