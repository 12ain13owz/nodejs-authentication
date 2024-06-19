import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "./../schema/user.schema";
import log from "../utils/logger";
import {
  createUser,
  fidnUserByEmail,
  findUserById,
} from "../services/user.service";
import { sendEmail } from "../utils/mailer";
import { ErrorResponse } from "../models/error.model";
import { nanoid } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const body = req.body;
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}. Id: ${user.id}`,
    });

    res.send("Successfully created user");
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`createUserHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  try {
    const { id, verificationCode } = req.params;
    // find the user by id
    const user = await findUserById(id);
    if (!user) throw { status: 401, message: "Could not verify user" };

    // check to see of they are alread verified
    if (user.verified)
      throw { status: 400, message: "User is already verified" };

    // check to see if the verificationCode matches
    if (user.verificationCode !== verificationCode)
      throw { status: 400, message: "Could not verify user" };

    user.verified = true;
    await user.save();

    res.send("Successfully verified");
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`verifyUserHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  try {
    const email = req.body.email;
    const user = await fidnUserByEmail(email);

    if (!user)
      throw {
        status: 404,
        message: `User with email ${email} does not exists`,
      };

    if (!user.verified) throw { status: 401, message: "User is not verified" };

    const passwordResetCode = nanoid();
    console.log("passwordResetCode:", passwordResetCode);
    user.passwordResetCode = passwordResetCode;
    await user.save();
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Reset your password",
      text: `Password reset code: ${passwordResetCode}. ID ${user._id}`,
    });

    log.debug(`Password reset email set to ${email}`);
    res.send(
      "If a user with that email is registered you will receive a password reset email"
    );
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`forgotPasswordHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  try {
    const { id, passwordResetCode } = req.params;
    const password = req.body.password;
    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwordResetCode
    )
      throw { status: 400, message: "Could not reset user password" };

    user.passwordResetCode = null;
    user.password = password;
    await user.save();

    res.send("Successfully updated user password");
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`resetPasswordHandler: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  try {
    console.log(res.locals);
    res.send(res.locals.user);
  } catch (error) {
    const e = error as ErrorResponse;
    log.error(`getCurrentUser: ${e.message}`);

    if (e.status) return res.status(e.status).send(e.message);
    res.status(500).send(e.message);
  }
}
