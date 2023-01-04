import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { PRODUCT_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/mongo.interfaces';
import {
  ProductEntity,
  ProductEntityTranslated,
} from './interfaces/product.interface';
import {
  GetProductsOpts,
  GetProductOpts,
  PatchProductOpts,
  ProductKeys,
} from './types/product.type';
import { Language } from '../common/types/i18n.types';
import { isArrays, equalArrays } from '../common/utils/arrays.utils';
import { equalObjectsValue, isObjects } from '../common/utils/object.utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectCollectionModel(PRODUCT_COLLECTION)
    private readonly productCollection: ICollectionModel<ProductEntity>,
  ) {}

  static getTranslatedField(field, language) {
    if (field) {
      if (Array.isArray(field)) {
        return field.map((product) => product[language]);
      }

      if (typeof field === 'object' && field !== null && language in field) {
        return field[language];
      }
    }

    return field;
  }

  static getTranslatedProduct(
    product: ProductEntity,
    language: Language,
  ): Partial<ProductEntityTranslated> {
    const productKeys = Object.keys(product) as ProductKeys;
    let result: Partial<ProductEntityTranslated> = {};

    productKeys.forEach((key) => {
      const attributeValues = product[key];

      result = {
        ...result,
        [key]: ProductService.getTranslatedField(attributeValues, language),
      };
    });

    return result;
  }

  static getTranslatedProducts(
    products: ProductEntity[],
    language: Language,
  ): Partial<ProductEntityTranslated>[] {
    return products.map((product) =>
      ProductService.getTranslatedProduct(product, language),
    );
  }

  static isFieldsEqual(fieldA: any, fieldB: any): boolean {
    if (isObjects(fieldA, fieldB)) {
      return equalObjectsValue(fieldA, fieldB);
    }

    if (isArrays(fieldA, fieldB)) {
      return equalArrays(fieldA, fieldB);
    }

    return fieldA === fieldB;
  }

  async getProducts(
    opts: GetProductsOpts,
  ): Promise<Partial<ProductEntityTranslated>[]> {
    const products = await this.productCollection.find({});

    return ProductService.getTranslatedProducts(products, opts.language);
  }

  async getProduct(opts: GetProductOpts): Promise<ProductEntity | null> {
    return await this.productCollection.findOne({
      _id: new ObjectId(opts.productId),
    });
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity | null> {
    return await this.productCollection.create(product);
  }

  async updateProduct({ data }: PatchProductOpts) {
    if (data._id && typeof data._id === 'string') {
      const product = await this.getProduct({ productId: data._id });

      let updatedFields: Partial<ProductEntity> = {};

      const { _id, ...productWithoutId } = product;
      const productKeys = Object.keys(productWithoutId) as ProductKeys;

      productKeys.forEach((key) => {
        const dataValue = data[key];

        if (!ProductService.isFieldsEqual(dataValue, product[key])) {
          updatedFields = {
            ...updatedFields,
            [key]: dataValue,
          };
        }
      });

      return this.productCollection.updateOne({ _id }, updatedFields);
    }
  }
}
