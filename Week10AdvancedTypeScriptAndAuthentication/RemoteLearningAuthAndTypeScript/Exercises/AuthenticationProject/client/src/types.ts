export interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
  joinedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData extends Credentials {
  name: string;
}
