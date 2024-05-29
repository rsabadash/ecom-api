export const MODULE_NAME = 'Suppliers module';

export const ERROR = {
  SUPPLIER_NOT_FOUND: 'Supplier has not been found',
  SUPPLIER_NOT_CREATED: 'Supplier has not been created',
  SUPPLIER_NOT_UPDATED: 'Supplier has not been updated',
};

export const SUCCESS = {
  GET_SUPPLIERS: 'Pagination list of suppliers',
  GET_SUPPLIER: 'Supplier data',
  CREATE_SUPPLIER: 'Supplier has been created',
  UPDATE_SUPPLIER: 'Supplier has been updated',
  DELETE_SUPPLIER: 'Supplier has been deleted',
  DROPDOWN_LIST: 'Dropdown list of suppliers',
};

export const DESCRIPTION = {
  ID: {
    type: 'string',
    description: 'Supplier identifier',
  },
  NAME: {
    description: 'Supplier name',
  },
  ADDRESS: {
    description: 'Supplier address',
    nullable: true,
  },
  PHONE_NUMBER: {
    description: 'Supplier phone number',
    nullable: true,
  },
};
