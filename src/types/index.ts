// Todo Types
export interface TodoItem {
  type: string;
  name: string;
  id?: string;
  done?: boolean;
}

// User Types
export interface UserAddress {
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: UserAddress;
  company: {
    department: string;
    name: string;
    title: string;
    address?: UserAddress;
  };
  [key: string]: unknown;
}

export interface UsersByDepartment {
  [department: string]: User[];
} 