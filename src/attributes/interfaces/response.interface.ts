import { AttributeEntity } from './attribute.interface';
import { PaginationData } from '../../common/interfaces/pagination.interface';
import { VariantEntity } from './variant.interface';
import { ObjectId } from 'mongodb';

export interface AttributeEntityResponse extends AttributeEntity {}

export interface GetAttributesResponse
  extends PaginationData<AttributeEntityResponse> {}

export interface GetAttributeResponse extends AttributeEntityResponse {}

export interface CreateAttributeResponse extends AttributeEntityResponse {}

export interface VariantWithAttributeEntityResponse extends VariantEntity {
  attributeId: ObjectId;
  attributeName: string;
}

export interface GetVariantsResponse
  extends PaginationData<VariantWithAttributeEntityResponse> {}

export interface GetVariantResponse extends VariantEntity {}

export interface CreateVariantResponse extends VariantEntity {
  attributeId: string;
}
