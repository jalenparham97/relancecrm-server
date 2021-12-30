import { FilterQuery, Model } from 'mongoose';

export const getDocumentsCount = async <T>(
  query: FilterQuery<T>,
  model: Model<T>,
) => {
  return await model.countDocuments(query);
};
