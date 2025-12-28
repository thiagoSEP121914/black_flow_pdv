export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  userType: string;
  companyId: string;
  name?: string;
  role?: string;
}
