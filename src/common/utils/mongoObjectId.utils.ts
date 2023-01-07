import { ObjectId, ObjectID } from 'mongodb';

export const isValidObjectId = (id: string | ObjectId) => {
  return id && typeof id === 'string' && ObjectID.isValid(id);
};
