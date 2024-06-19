import jwt from "jsonwebtoken";
import config from "config";
import { ErrorResponse } from "../models/error.model";
import log from "./logger";

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  try {
    const signingKey = config.get<string>(keyName);

    return jwt.sign(object, signingKey, {
      algorithm: "RS256",
      ...(options && options),
    });
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`signJwt: ${e.message}`);

    return null;
  }
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  try {
    const publicKey = config.get<string>(keyName);
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`verifyJwt: ${e.message}`);

    return null;
  }
}
