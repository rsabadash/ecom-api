export const MODULE_NAME = 'Categories module';

export const ERROR = {
  CATEGORY_NOT_FOUND: 'Category has not been found',
  CATEGORY_NOT_CREATED: 'Category has not been created',
  CATEGORY_NOT_CREATED_WRONG_PARENT_ID:
    'Category has not been created. Wrong parent id for the category',
  CATEGORY_NOT_UPDATED: 'Category has not been updated',
};

export const SUCCESS = {
  GET_CATEGORIES: 'Pagination list of categories',
  GET_CATEGORY: 'Category data',
  CREATE_CATEGORY: 'Category has been created',
  UPDATE_CATEGORY: 'Category has been updated',
  DELETE_CATEGORY: 'Category has been deleted',
  DROPDOWN_LIST: 'Dropdown list of categories',
};

export const DESCRIPTION = {
  ID: {
    type: 'string',
    description: 'Category identifier',
  },
  NAME: { description: 'Category name' },
  SEO_NAME: {
    description:
      'Search engine optimization category name (only numbers and lowercase Latin letters separated by a hyphen are allowed)',
    example: 'test-category-name-123',
  },
  IS_ACTIVE: {
    description: 'Is category visible for public users',
    default: false,
  },
  CHILDREN_IDS: {
    description: 'Children category identifiers of the category',
  },
  PARENT_ID: {
    type: 'string',
    description: 'Parent category identifier of the category',
    nullable: true,
  },
  PARENT_IDS_HIERARCHY: {
    description:
      'Parent category identifiers of the category in hierarchy order (index 0 - highest parent, last index - lowest parent)',
  },
  PARENTS: {
    description: 'Parent categories with full data in hierarchy order',
  },
};

export const VALIDATION_MESSAGE = {
  SEO_NAME:
    'Only numbers and lowercase Latin letters separated by a hyphen are allowed',
};
