export type CollectionNavStackParamList = {
  CollectionsList: { userId: number } | { userId: number, refresh: number };
  CollectionInfo: { collectionId: string }
};