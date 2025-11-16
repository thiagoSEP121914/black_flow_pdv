export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  companyId: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  name: string;
  phone: string;
  active: boolean;
  userType: "owner" | "operator";
  role?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
