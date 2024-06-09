import { Unit } from '../enums/unit.enum';

export const MODULE_NAME = 'Products module';

export const ERROR = {
  PRODUCTS_NOT_CREATED: 'Products have not been created',
};

export const SUCCESS = {
  GET_PRODUCTS: 'Pagination list of products',
  CREATE_PRODUCTS: 'Products have been created',
  DROPDOWN_LIST: 'Dropdown list of products',
};

export const DESCRIPTION = {
  ID: { description: 'Product identifier' },
  NAME: { description: 'Product name' },
  SKU: { description: 'Unique SKU identifier of product' },
  UNIT: {
    description: 'Product measurement unit',
    enum: Unit,
    example: [
      Unit.Meter,
      Unit.Centimetre,
      Unit.Millimetre,
      Unit.Liter,
      Unit.Milliliter,
      Unit.Kilogram,
      Unit.Gram,
      Unit.Milligram,
      Unit.Item,
    ],
  },
  ATTRIBUTES: {
    description: 'Product attributes',
    nullable: true,
  },
  ATTRIBUTE_ID: { description: 'Attribute identifier related to product' },
  ATTRIBUTE_NAME: { description: 'Attribute name related to product' },
  VARIANTS: { description: 'Product variants' },
  VARIANT_ID: { description: 'Variant identifier related to product' },
  VARIANT_NAME: { description: 'Variant name related to product' },
  CREATED_AT: { description: 'Product creation date' },
  SUPPLY_IDS: {
    description: 'Supply identifiers that is related to product',
    nullable: true,
  },
  WAREHOUSES: {
    description: 'List of warehouses where the product is located',
    nullable: true,
  },
  WAREHOUSE_ID: { description: 'Warehouse identifier' },
  TOTAL_QUANTITY: {
    description: 'Quantity of product in warehouse',
    nullable: true,
  },
  IS_DELETED: {
    description: 'Is product logically deleted',
    default: false,
  },
};
