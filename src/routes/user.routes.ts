import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import { requireUser } from "../middleware/requireUser";
const router = Router();

router.post("/api/users", validate(createUserSchema), createUserHandler);
router.post(
  "/api/users/verify/:id/:verificationCode",
  validate(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/api/users/forgotPassword",
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  "/api/users/resetpassword/:id/:passwordResetCode",
  validate(resetPasswordSchema),
  resetPasswordHandler
);

router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;
