import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import { User, privateFields } from "../models/user.model";
import { ErrorResponse } from "../models/error.model";
import log from "../utils/logger";
import { signJwt } from "../utils/jwt";
import { SessionModel } from "../models/session.model";

export async function createSession(userId: string) {
  return SessionModel.create({ user: userId });
}

export function signAccessToken(user: DocumentType<User>) {
  try {
    const payload = omit(user.toJSON(), privateFields);
    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
      expiresIn: "15m",
    });

    return accessToken;
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`signAccessToken: ${e.message}`);

    return null;
  }
}

export async function signRefreshToken(userId: string) {
  try {
    const session = await createSession(userId);
    const refrestToken = signJwt(
      { session: session._id },
      "refreshTokenPrivateKey",
      { expiresIn: "1y" }
    );

    return refrestToken;
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`signAccessToken: ${e.message}`);

    return null;
  }
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
