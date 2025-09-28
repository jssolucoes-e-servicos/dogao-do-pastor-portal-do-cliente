export interface ICell {
  id: string;
  name: string;
  leaderName: string;
  networkName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}