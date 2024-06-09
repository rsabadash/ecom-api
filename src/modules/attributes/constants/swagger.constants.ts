export const MODULE_NAME = 'Attributes module';

export const ERROR = {
  ATTRIBUTE_NOT_FOUND: 'Attribute has not been found',
  ATTRIBUTE_NOT_CREATED: 'Attribute has not been created',
  ATTRIBUTE_NOT_UPDATED: 'Attribute has not been updated',
  VARIANT_NOT_FOUND: 'Variant has not been found',
  VARIANT_NOT_CREATED: 'Variant has not been created',
  VARIANT_NOT_UPDATED: 'Variant has not been updated',
};

export const SUCCESS = {
  GET_ATTRIBUTES: 'Pagination list of attributes',
  GET_ATTRIBUTE: 'Attribute data',
  CREATE_ATTRIBUTE: 'Attribute has been created',
  UPDATE_ATTRIBUTE: 'Attribute has been updated',
  DELETE_ATTRIBUTE: 'Attribute has been deleted',
  GET_VARIANTS: 'Pagination list of variants',
  GET_VARIANT: 'Variant data',
  CREATE_VARIANT: 'Variant has been created',
  UPDATE_VARIANT: 'Variant has been updated',
  DELETE_VARIANT: 'Variant has been deleted',
};

export const DESCRIPTION = {
  ATTRIBUTE_ID: {
    type: 'string',
    description: 'Attribute identifier',
  },
  ATTRIBUTE_NAME: {
    description: 'Attribute name',
  },
  SEO_NAME: {
    description:
      'Search engine optimization name (only numbers and lowercase Latin letters separated by a hyphen are allowed)',
  },
  IS_ACTIVE: {
    description: 'Is attribute visible for public users',
    default: false,
  },
  VARIANTS: {
    description: 'Attribute variants',
    nullable: true,
  },
  VARIANT_ID: {
    description: 'Variant identifier',
  },
  VARIANT_NAME: {
    description: 'Variant name',
  },
  VARIANT_IS_ACTIVE: {
    description: 'Is variant visible for public users',
  },
};

export const VALIDATION_MESSAGE = {
  SEO_NAME:
    'Only numbers and lowercase Latin letters separated by a hyphen are allowed',
};
