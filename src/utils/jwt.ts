import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";

export const createJWT = (payload): string => {
  const { secret, expiresIn } = authConfig;

  return sign(
    payload,
    secret,
    {
      expiresIn
    }
  );
};

export const createRefreshJWT = (payload): string => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign(
    payload,
    refreshSecret,
    {
      expiresIn: refreshExpiresIn
    }
  );
};

export const createJWT2FA = (payload): string => {
  const { secret } = authConfig;

  return sign(
    payload,
    secret,
    {
      expiresIn: '3m'
    }
  );
};
