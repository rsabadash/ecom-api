import { Translations } from '../../common/types/i18n.types';

export interface IVariant {
  variantId: string;
  seoName: string;
  name: Translations;
  isActive: boolean;
  sortOrder: null | number;
}

export interface IVariantCreate extends Omit<IVariant, 'variantId'> {
  attributeId: string;
}

export interface IVariantUpdate extends Partial<Omit<IVariant, 'variantId'>> {
  attributeId: string;
  variantId: string;
}

export interface IVariantDelete {
  attributeId: string;
  variantId: string;
}
