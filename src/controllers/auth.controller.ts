import { Request, Response } from "express";
import log from "../utils/logger";
import { ErrorResponse } from "../models/error.model";
import { CreateSessionInput } from "../schema/auth.sehema";
import { fidnUserByEmail, findUserById } from "../services/user.service";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../services/auth.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const user = await fidnUserByEmail(email);
    if (!user)
      throw {
        status: 400,
        message: `Invalid email or password`,
      };
    if (!user.verified)
      throw { status: 401, message: "Please verify your email" };

    const isValid = await user.validatePassword(password);
    if (!isValid) throw { status: 400, message: "Invalid email or password" };

    // sign a access token
    const accessToken = signAccessToken(user);

    // sign a refresh token
    const refreshToken = await signRefreshToken(user.id);

    // send the tokens
    res.send({ accessToken, refreshToken });
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`createSessionHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  try {
    let errorMessage = "Could not refresh access token";
    const refreshToken = String(get(req, "headers.x-refresh"));

    const decoded = verifyJwt<{ session: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!decoded) throw { status: 401, message: errorMessage };

    const session = await findSessionById(decoded.session);
    if (!session || !session.valid)
      throw { status: 401, message: errorMessage };

    const user = await findUserById(String(session.user));
    if (!user) throw { status: 401, message: errorMessage };

    const accessToken = signAccessToken(user);

    res.send({ accessToken });
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`refreshAccessTokenHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}
