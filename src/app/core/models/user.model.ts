export type UserRole = 'CAMPER' | 'SITE_OWNER' | 'ORGANIZER';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
}