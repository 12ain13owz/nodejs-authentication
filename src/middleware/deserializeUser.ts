import { Request, Response, NextFunction } from "express";
import log from "../utils/logger";
import { ErrorResponse } from "../models/error.model";
import { verifyJwt } from "../utils/jwt";

// export const deserializeUser =
//   async () => (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accessToken = (req.headers.authorization || "").replace(
//         /^Bearer\s/,
//         ""
//       );
//       if (!accessToken) return next();

//       const decoded = verifyJwt(accessToken, "accessTokenPrivateKey");
//       if (decoded) res.locals.user = decoded;
//       next();
//     } catch (error) {
//       const e = error as ErrorResponse;
//       log.error(e);
//       res.status(500).send(e.message);
//     }
//   };

export default function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );
  if (!accessToken) return next();

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
  if (decoded) res.locals.user = decoded;
  next();
}
