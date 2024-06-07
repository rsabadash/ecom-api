import { WarehouseType } from '../enums/warehouse-types.enum';

export const MODULE_NAME = 'Warehouses module';

export const ERROR = {
  WAREHOUSE_NOT_FOUND: 'Warehouse has not been found',
  WAREHOUSE_NOT_CREATED: 'Warehouse has not been created',
  WAREHOUSE_NOT_UPDATED: 'Warehouse has not been updated',
};

export const SUCCESS = {
  GET_WAREHOUSES: 'List of warehouses',
  GET_WAREHOUSE: 'Warehouse data',
  CREATE_WAREHOUSE: 'Warehouse has been created',
  UPDATE_WAREHOUSE: 'Warehouse has been updated',
  DELETE_WAREHOUSE: 'Warehouse has been deleted',
  DROPDOWN_LIST: 'Dropdown list of warehouses',
};

export const DESCRIPTION = {
  ID: {
    type: 'string',
    description: 'Warehouse identifier',
  },
  NAME: {
    description: 'Warehouse name',
  },
  TYPE: {
    description: 'Warehouse type',
    enum: WarehouseType,
    example: [
      WarehouseType.Shop,
      WarehouseType.OnlineStore,
      WarehouseType.Warehouse,
    ],
  },
  ADDRESS: {
    description: 'Warehouse address',
    nullable: true,
  },
};
