export interface ICustomerAdress {
  id?: string;
  customerId: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  active?: boolean;
}