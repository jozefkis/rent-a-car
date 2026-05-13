export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string; // Ne šaljemo uvek sa back-a
  passportNumber: string;
  idCardNumber: string;
  role: 'admin' | 'customer';
  token?: string;
}