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
  GetSupplyParameters,
  ISupply,
  ISupplyCreate,
  ISupplyProduct,
  ISupplyProductToCreate,
} from './interfaces/supplies.interfaces';
import { WarehouseProductsService } from '../warehouseProducts/warehouse-products.service';
import { MathService } from '../common/services/math.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import {
  IWarehouseProduct,
  IWarehouseProductWarehouses,
} from '../warehouseProducts/interfaces/warehouse-products.interfaces';
import { BulkResult } from '../mongo/types/colection-model.types';
import { CONNECTION_DB_NAME } from '../common/constants/database.contants';
import {
  ClientsMap,
  FindEntityOptions,
  PartialEntity,
} from '../mongo/types/mongo-query.types';
import { PaginationData } from '../common/interfaces/pagination.interface';
import { EntityNotFoundException } from '../common/exeptions/entity-not-found.exception';
import { getPaginationPipeline } from '../common/utils/getPaginationPipeline';
import { ERROR } from './constants/message.constants';

@Injectable()
export class SuppliesService {
  private client: MongoClient;
  constructor(
    @InjectCollectionModel(SUPPLIES_COLLECTION)
    private readonly supplyCollection: ICollectionModel<ISupply>,
    private readonly warehouseProductsService: WarehouseProductsService,
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

  private async getWarehouseProductsToAdd(
    products: ISupplyProductToCreate[],
  ): Promise<IWarehouseProduct[]> {
    const productToAddIds = products.map((product) => {
      return new ObjectId(product.productId);
    });

    const warehouseProductsPagination =
      await this.warehouseProductsService.getWarehouseProducts(
        {
          _id: { $in: productToAddIds },
        },
        { skip: 0, limit: productToAddIds.length },
      );

    return warehouseProductsPagination.data;
  }

  private addVariationsToSupplyProducts(
    warehouseProducts: IWarehouseProduct[],
    productsToAdd: ISupplyProductToCreate[],
  ): ISupplyProduct[] {
    const productsToSupplyCollection: ISupplyProduct[] = [];

    warehouseProducts.forEach((warehouseProduct) => {
      const productToSupply = productsToAdd.find((product) => {
        return warehouseProduct._id.toString() === product.productId;
      });

      if (productToSupply) {
        let productAttributeIds: string[] = [];
        let productVariantIds: string[] = [];

        if (
          warehouseProduct.attributes &&
          warehouseProduct.attributes?.length > 0
        ) {
          const productAttributeIdsSet = new Set<string>();
          const productVariantIdsSet = new Set<string>();

          warehouseProduct.attributes.forEach((attribute) => {
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
          productName: warehouseProduct.name,
          attributeIds: productAttributeIds,
          variantIds: productVariantIds,
        });
      }
    });

    return productsToSupplyCollection;
  }

  private updateWarehouseProductsList(
    warehouseProducts: IWarehouseProduct[],
    productsToAdd: ISupplyProductToCreate[],
    warehouseIdToAdd: string,
    supplyIdToAdd: string,
  ): IWarehouseProduct[] {
    const updateWarehouseProductsList: IWarehouseProduct[] = [];

    warehouseProducts.forEach((warehouseProduct) => {
      const productToAdd = productsToAdd.find((product) => {
        return warehouseProduct._id.toString() === product.productId;
      });

      const hasWarehouse = warehouseProduct.warehouses.some((warehouse) => {
        return warehouse.warehouseId === warehouseIdToAdd;
      });

      if (productToAdd) {
        let updatedWarehouses: IWarehouseProductWarehouses[];

        if (hasWarehouse) {
          updatedWarehouses = warehouseProduct.warehouses.map((warehouse) => {
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
            ...warehouseProduct.warehouses,
            {
              warehouseId: warehouseIdToAdd,
              totalQuantity: productToAdd.quantity,
            },
          ];
        }

        const updatedSupplyIds =
          warehouseProduct?.supplyIds?.length > 0
            ? [...warehouseProduct.supplyIds, supplyIdToAdd]
            : [supplyIdToAdd];

        updateWarehouseProductsList.push({
          ...warehouseProduct,
          warehouses: updatedWarehouses,
          supplyIds: updatedSupplyIds,
        });
      }
    });

    return updateWarehouseProductsList;
  }

  private async bulkWarehouseProductsUpdate(
    warehouseProductsToUpdate: IWarehouseProduct[],
    options: BulkWriteOptions,
  ): Promise<BulkResult> {
    const preparedBulkUpdateFilter: BulkUpdateFilter[] =
      warehouseProductsToUpdate.map(({ _id, supplyIds, warehouses }) => {
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
      });

    return await this.warehouseProductsService.bulkWrite(
      preparedBulkUpdateFilter,
      options,
    );
  }

  async getSupplies(
    query: PartialEntity<ISupply> = {},
    options: FindEntityOptions<ISupply> = {},
  ): Promise<PaginationData<ISupply>> {
    const { skip, limit } = options;

    const pipeline = getPaginationPipeline({
      query,
      filter: {
        skip,
        limit,
      },
    });

    const paginatedData = await this.supplyCollection.aggregate<
      PaginationData<ISupply>
    >(pipeline);

    return paginatedData[0];
  }

  async getSupply(parameters: GetSupplyParameters): Promise<ISupply> {
    const supply = await this.supplyCollection.findOne({
      _id: new ObjectId(parameters.supplyId),
    });

    if (!supply) {
      throw new EntityNotFoundException(ERROR.SUPPLY_NOT_FOUND);
    }

    return supply;
  }

  async createSupply(createSupply: ISupplyCreate): Promise<void> {
    // TODO check duplication
    const productsToAdd: ISupplyProductToCreate[] = createSupply.products;

    const warehouseProducts: IWarehouseProduct[] =
      await this.getWarehouseProductsToAdd(productsToAdd);

    if (warehouseProducts.length < 1) {
      throw new BadRequestException(ERROR.NO_PRODUCTS_FOUND);
    }

    const productsToSupplyWithVariations: ISupplyProduct[] =
      this.addVariationsToSupplyProducts(warehouseProducts, productsToAdd);

    if (productsToSupplyWithVariations.length < 1) {
      throw new BadRequestException(ERROR.NO_PRODUCTS_TO_ADD);
    }

    const session = this.client.startSession();

    try {
      await session.withTransaction(async () => {
        const newSupply = await this.supplyCollection.create(
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

        const updatedWarehouseProducts: IWarehouseProduct[] =
          this.updateWarehouseProductsList(
            warehouseProducts,
            productsToAdd,
            createSupply.warehouseId,
            newSupply._id.toString(),
          );

        if (updatedWarehouseProducts.length < 1) {
          throw new BadRequestException(ERROR.NO_PRODUCTS_TO_UPDATE);
        }

        const result = await this.bulkWarehouseProductsUpdate(
          updatedWarehouseProducts,
          { session },
        );

        if (result.nModified < 1) {
          throw new BadRequestException(ERROR.NO_PRODUCTS_WERE_UPDATED);
        }
      });
    } finally {
      await session.endSession();
    }
  }
}
