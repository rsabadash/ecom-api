import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BulkWriteOptions, MongoClient, ObjectId } from 'mongodb';
import {
  InjectClients,
  InjectCollectionModel,
} from '../mongo/decorators/mongo.decorators';
import { SUPPLIES_COLLECTION } from '../common/constants/collections.constants';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  BulkUpdateFilter,
  CreateSupply,
  CreateSupplyProduct,
  GetSupplyParameters,
  ISupplyProduct,
  SupplyEntity,
} from './interfaces/supplies.interfaces';
import { ProductsService } from '../products/products.service';
import { MathService } from '../common/services/math.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { ProductWarehouses } from '../products/interfaces/product.interfaces';
import { BulkResult } from '../mongo/types/colection-model.types';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import {
  ClientsMap,
  FindEntityOptions,
} from '../mongo/types/mongo-query.types';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { ERROR } from './constants/swagger.constants';
import { ProductEntityResponse } from '../products/interfaces/response.interface';
import {
  CreateSupplyResponse,
  GetSuppliesResponse,
  GetSupplyResponse,
} from './interfaces/response.interface';

@Injectable()
export class SuppliesService {
  private client: MongoClient;
  constructor(
    @InjectCollectionModel(SUPPLIES_COLLECTION)
    private readonly supplyCollection: ICollectionModel<SupplyEntity>,
    private readonly productsService: ProductsService,
    private readonly suppliersService: SuppliersService,
    private readonly mathService: MathService,
    @InjectClients(CONNECTION_DB_NAME)
    private readonly clients: ClientsMap,
  ) {
    const client = this.clients.get(CONNECTION_DB_NAME);

    if (!client) {
      throw new ServiceUnavailableException(
        'Connection to database is unavailable is SuppliesService',
      );
    }

    this.client = client;
  }

  private async getProductsToAdd(
    products: CreateSupplyProduct[],
  ): Promise<ProductEntityResponse[]> {
    const productToAddIds = products.map((product) => {
      return new ObjectId(product.productId);
    });

    const productsPagination = await this.productsService.getProducts(
      {
        _id: { $in: productToAddIds },
      },
      { skip: 0, limit: productToAddIds.length },
    );

    return productsPagination.data;
  }

  private addVariationsToSupplyProducts(
    products: ProductEntityResponse[],
    productsToAdd: CreateSupplyProduct[],
  ): ISupplyProduct[] {
    const productsToSupplyCollection: ISupplyProduct[] = [];

    products.forEach((product) => {
      const productToSupply = productsToAdd.find((productToAdd) => {
        return product._id.toString() === productToAdd.productId;
      });

      if (productToSupply) {
        let productAttributeIds: string[] = [];
        let productVariantIds: string[] = [];

        if (product.attributes && product.attributes?.length > 0) {
          const productAttributeIdsSet = new Set<string>();
          const productVariantIdsSet = new Set<string>();

          product.attributes.forEach((attribute) => {
            productAttributeIdsSet.add(attribute.attributeId);

            if (attribute.variants && attribute.variants.length > 0) {
              attribute.variants.forEach((variant) => {
                productVariantIdsSet.add(variant.variantId);
              });
            }
          });

          productAttributeIds = Array.from(productAttributeIdsSet);
          productVariantIds = Array.from(productVariantIdsSet);
        }

        productsToSupplyCollection.push({
          ...productToSupply,
          productName: product.name,
          attributeIds: productAttributeIds,
          variantIds: productVariantIds,
        });
      }
    });

    return productsToSupplyCollection;
  }

  private updateProductsList(
    products: ProductEntityResponse[],
    productsToAdd: CreateSupplyProduct[],
    warehouseIdToAdd: string,
    supplyIdToAdd: string,
  ): ProductEntityResponse[] {
    const updateProductsList: ProductEntityResponse[] = [];

    products.forEach((product) => {
      const productToAdd = productsToAdd.find((productToAdd) => {
        return product._id.toString() === productToAdd.productId;
      });

      const hasWarehouse = product.warehouses.some((warehouse) => {
        return warehouse.warehouseId === warehouseIdToAdd;
      });

      if (productToAdd) {
        let updatedWarehouses: ProductWarehouses[];

        if (hasWarehouse) {
          updatedWarehouses = product.warehouses.map((warehouse) => {
            if (warehouse.warehouseId === warehouseIdToAdd) {
              const newTotalQuantity = this.mathService.add(
                warehouse.totalQuantity,
                productToAdd.quantity,
              );

              return {
                ...warehouse,
                totalQuantity:
                  this.mathService.parseToDecimal(newTotalQuantity),
              };
            }

            return warehouse;
          });
        } else {
          updatedWarehouses = [
            ...product.warehouses,
            {
              warehouseId: warehouseIdToAdd,
              totalQuantity: productToAdd.quantity,
            },
          ];
        }

        const updatedSupplyIds =
          product?.supplyIds?.length > 0
            ? [...product.supplyIds, supplyIdToAdd]
            : [supplyIdToAdd];

        updateProductsList.push({
          ...product,
          warehouses: updatedWarehouses,
          supplyIds: updatedSupplyIds,
        });
      }
    });

    return updateProductsList;
  }

  private async bulkProductsUpdate(
    productsToUpdate: ProductEntityResponse[],
    options: BulkWriteOptions,
  ): Promise<BulkResult> {
    const preparedBulkUpdateFilter: BulkUpdateFilter[] = productsToUpdate.map(
      ({ _id, supplyIds, warehouses }) => {
        return {
          updateOne: {
            filter: { _id },
            update: {
              $set: {
                supplyIds,
                warehouses,
              },
            },
          },
        };
      },
    );

    return this.productsService.bulkWrite(preparedBulkUpdateFilter, options);
  }

  async getSupplies(
    query: Record<string, string> = {},
    options: FindEntityOptions<SupplyEntity> = {},
  ): Promise<GetSuppliesResponse> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData =
      await this.supplyCollection.aggregate<GetSuppliesResponse>(pipeline);

    return paginatedData[0];
  }

  async getSupply(parameters: GetSupplyParameters): Promise<GetSupplyResponse> {
    const supply = await this.supplyCollection.findOne({
      _id: new ObjectId(parameters.supplyId),
    });

    if (!supply) {
      throw new EntityNotFoundException(ERROR.SUPPLY_NOT_FOUND);
    }

    return supply;
  }

  async createSupply(
    createSupply: CreateSupply,
  ): Promise<CreateSupplyResponse> {
    // TODO check duplication
    const productsToAdd: CreateSupplyProduct[] = createSupply.products;

    const products: ProductEntityResponse[] = await this.getProductsToAdd(
      productsToAdd,
    );

    if (products.length < 1) {
      throw new BadRequestException(ERROR.NO_PRODUCTS_FOUND);
    }

    const productsToSupplyWithVariations: ISupplyProduct[] =
      this.addVariationsToSupplyProducts(products, productsToAdd);

    if (productsToSupplyWithVariations.length < 1) {
      throw new BadRequestException(ERROR.NO_PRODUCTS_TO_ADD);
    }

    const session = this.client.startSession();

    let newSupply: SupplyEntity | null = null;

    try {
      await session.withTransaction(async () => {
        newSupply = await this.supplyCollection.create(
          {
            ...createSupply,
            products: productsToSupplyWithVariations,
            createdAt: new Date(),
          },
          { session },
        );

        if (!newSupply) {
          throw new BadRequestException(ERROR.SUPPLY_NOT_CREATED);
        }

        const updatedProducts: ProductEntityResponse[] =
          this.updateProductsList(
            products,
            productsToAdd,
            createSupply.warehouseId,
            newSupply._id.toString(),
          );

        if (updatedProducts.length < 1) {
          throw new BadRequestException(ERROR.NO_PRODUCTS_TO_UPDATE);
        }

        const result = await this.bulkProductsUpdate(updatedProducts, {
          session,
        });

        if (result.nModified < 1) {
          throw new BadRequestException(ERROR.NO_PRODUCTS_WERE_UPDATED);
        }
      });

      if (!newSupply) {
        throw new BadRequestException(ERROR.SUPPLY_NOT_CREATED);
      }

      return newSupply;
    } finally {
      await session.endSession();
    }
  }
}
