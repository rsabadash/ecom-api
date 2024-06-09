import {
  ATTRIBUTE_ID,
  VARIANT_ID,
} from '../../../common/constants/cross-entity-id.constants';

export interface VariantEntity {
  [VARIANT_ID]: string;
  seoName: string;
  name: string;
  isActive: boolean;
}

export interface IVariant {
  [VARIANT_ID]: string;
  seoName: string;
  name: string;
  isActive: boolean;
}

export interface IVariantWithAttributeId extends IVariant {
  [ATTRIBUTE_ID]: string;
}

export interface CreateVariant {
  seoName: string;
  name: string;
  isActive: boolean;
  [ATTRIBUTE_ID]: string;
}

export interface UpdateVariant {
  [VARIANT_ID]: string;
  [ATTRIBUTE_ID]: string;
  seoName?: string;
  name?: string;
  isActive?: boolean;
}

export interface DeleteVariant {
  [ATTRIBUTE_ID]: string;
  [VARIANT_ID]: string;
}

export interface GetVariantParameters {
  [ATTRIBUTE_ID]: string;
  [VARIANT_ID]: string;
}
