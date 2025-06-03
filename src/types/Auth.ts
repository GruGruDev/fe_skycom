import { TUser } from "./User";

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type TAuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<TUser> | null;
};

export type TJWTContext = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Partial<TUser> | null;
  method: "jwt";
  login: ({ email, password }: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<TUser>) => void;
  getProfile: () => void;
  initialize: () => void;
};
