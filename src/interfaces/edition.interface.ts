export interface IEdition {
  id: string;
  name: string;
  productionDate: Date;
  dogPrice: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
