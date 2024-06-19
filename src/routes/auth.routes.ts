import express from "express";
import { validate } from "../middleware/validate";
import { createSessionSehema } from "../schema/auth.sehema";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "../controllers/auth.controller";
const router = express.Router();

router.post(
  "/api/session",
  validate(createSessionSehema),
  createSessionHandler
);

router.post("/api/session/refresh", refreshAccessTokenHandler);

export default router;
