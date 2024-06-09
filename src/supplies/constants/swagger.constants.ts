export const MODULE_NAME = 'Supplies module';

export const ERROR = {
  SUPPLY_NOT_FOUND: 'Supply has not been found',
  SUPPLY_NOT_CREATED: 'Supply has not been created',
  NO_PRODUCTS_FOUND: 'Supply has not been created. No products were found',
  NO_PRODUCTS_TO_ADD: 'Supply has not been created. No products to add',
  NO_PRODUCTS_TO_UPDATE: 'Supply has not been created. No products to update',
  NO_PRODUCTS_WERE_UPDATED:
    'Supply has not been created.No products were updated',
};

export const SUCCESS = {
  GET_SUPPLIES: 'Pagination list of supplies',
  GET_SUPPLY: 'Supply data',
  CREATE_SUPPLY: 'Supply has been created',
};

export const DESCRIPTION = {
  ID: {
    description: 'Supply identifier',
  },
  NAME: {
    description: 'Supply name',
    nullable: true,
  },
  PRODUCTS: {
    description: 'List of products in supply',
  },
  PRODUCT_ID: {
    description: 'Product identifier',
  },
  PRODUCT_NAME: {
    description: 'Product name',
  },
  QUANTITY: {
    description: 'Quantity of product in supply',
  },
  PRICE: {
    description: 'Price of product in supply',
  },
  TOTAL_COST: {
    description: 'Total cost of product in supply',
  },
  ATTRIBUTE_IDS: {
    description: 'Attribute identifiers that are related to product',
    nullable: true,
  },
  VARIANT_IDS: {
    description: 'Variant identifiers that are related to product',
    nullable: true,
  },
  PRODUCTS_TOTAL_COST: {
    description: 'Total cost of all products in supply',
  },
  SUPPLIER_ID: {
    description: 'Supplier identifier that did the supply',
  },
  WAREHOUSE_ID: {
    description: 'Warehouse identifier that initially stored the supply',
  },
  CREATED_AT: {
    description: 'Supply creation date',
  },
};

export const VALIDATION_MESSAGE = {
  PRODUCTS_TOTAL_COST:
    'Total cost should be integer or decimal with a maximum of two sign',
  PRODUCTS_TOTAL_QUANTITY:
    'Quantity of product should be integer or decimal with a maximum of two sign',
  PRODUCTS_PRICE:
    'Price of product should be integer or decimal with a maximum of two sign',
  PRODUCT_TOTAL_COST:
    'Total cost of product should be integer or decimal with a maximum of two sign',
};
