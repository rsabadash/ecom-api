import {
  ATTRIBUTE_ID,
  VARIANT_ID,
} from '../../common/constants/cross-entity-id.constants';

export interface IVariant {
  [VARIANT_ID]: string;
  seoName: string;
  name: string;
  isActive: boolean;
}

export interface IVariantWithAttributeId extends IVariant {
  [ATTRIBUTE_ID]: string;
}

export interface IVariantCreate extends Omit<IVariant, 'variantId'> {
  [ATTRIBUTE_ID]: string;
}

export interface IVariantUpdate extends Partial<Omit<IVariant, 'variantId'>> {
  [ATTRIBUTE_ID]: string;
  [VARIANT_ID]: string;
}

export interface IVariantDelete {
  [ATTRIBUTE_ID]: string;
  [VARIANT_ID]: string;
}

export interface GetVariantParameters {
  [ATTRIBUTE_ID]: string;
  [VARIANT_ID]: string;
}
