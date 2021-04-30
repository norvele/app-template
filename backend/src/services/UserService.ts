import * as randToken from "rand-token";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User, UserDoc, UserProps } from "@/models/User";
import { ServiceError } from "@/services/ServiceError";

const JWT_SECRET = "appSecret";
type JWTPayload = { id: string };

export const ERROR_USER_NOT_FOUND = "userNotFound";
export const ERROR_USER_ALREADY_EXISTS = "userAlreadyExists";
export const ERROR_EMAIL_NOT_VERIFIED = "emailNotVerified";
export const ERROR_EMAIL_ALREADY_VERIFIED = "emailAlreadyVerified";
export const ERROR_INVALID_PASSWORD = "invalidPassword";
export const ERROR_INVALID_ACCESS_TOKEN = "invalidAccessToken";
export const ERROR_INVALID_VERIFY_EMAIL_CODE = "invalidVerifyEmailCode";
export const ERROR_INVALID_CHANGE_PASSWORD_CODE = "invalidChangePasswordCode";

export class UserService {
  async createUser({
    name,
    email,
    password,
  }: Pick<UserProps, "name" | "email" | "password">): Promise<UserDoc> {
    if (await this.getUserByEmail(email)) {
      throw new ServiceError({ code: ERROR_USER_ALREADY_EXISTS });
    }

    const verifyEmailCode = randToken.generate(16);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      verifyEmailCode,
      password: passwordHash,
    });
    await user.save();

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDoc | null> {
    return await User.findOne({ email }).exec();
  }

  async getUserById(id: string): Promise<UserDoc | null> {
    return User.findById(id);
  }

  async getUserByCredentials(
    email: string,
    password: string
  ): Promise<UserDoc> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new ServiceError({ code: ERROR_USER_NOT_FOUND });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ServiceError({ code: ERROR_INVALID_PASSWORD });
    }

    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.getUserByCredentials(email, password);

    if (!user.isEmailVerified) {
      throw new ServiceError({ code: ERROR_EMAIL_NOT_VERIFIED });
    }

    const payload: JWTPayload = { id: user.id };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  }

  async verifyUserAccessToken(token: string): Promise<JWTPayload> {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (e) {
      throw new ServiceError({ code: ERROR_INVALID_ACCESS_TOKEN }, e);
    }
  }

  async verifyUserEmail(verifyEmailCode: string): Promise<void> {
    const user = await User.findOne({ verifyEmailCode }).exec();
    if (!user) {
      throw new ServiceError({ code: ERROR_INVALID_VERIFY_EMAIL_CODE });
    }
    user.verifyEmailCode = undefined;
    user.isEmailVerified = true;
    await user.save();
  }

  async recreateUserVerifyEmailCode(
    email: string,
    password: string
  ): Promise<UserDoc> {
    const user = await this.getUserByCredentials(email, password);
    if (user.isEmailVerified) {
      throw new ServiceError({ code: ERROR_EMAIL_ALREADY_VERIFIED });
    }
    user.verifyEmailCode = randToken.generate(16);
    await user.save();
    return user;
  }

  async recreateUserChangePasswordCode(email: string): Promise<UserDoc> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new ServiceError({ code: ERROR_USER_NOT_FOUND });
    }
    user.changePasswordCode = randToken.generate(16);
    await user.save();
    return user;
  }

  async changeUserPasswordByCode(
    changePasswordCode: string,
    password: string
  ): Promise<UserDoc> {
    const user = await User.findOne({ changePasswordCode }).exec();
    if (!user) {
      throw new ServiceError({ code: ERROR_INVALID_CHANGE_PASSWORD_CODE });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.changePasswordCode = undefined;
    user.password = passwordHash;
    await user.save();
    return user;
  }
}
