export type Role = "user" | "admin";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
}

// What travels inside an access token and ends up on req.user.
export interface TokenUser {
  id: number;
  username: string;
  role: Role;
}

// Module augmentation: teach Express that a request can carry `user`.
declare module "express-serve-static-core" {
  interface Request {
    user?: TokenUser;
  }
}
