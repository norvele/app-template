import { FastifyPluginAsync } from "fastify";
import {
  registerSchema,
  errorCodes,
  loginSchema,
  verifyEmailSchema,
  resendVerifyEmailSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "@/schemas/auth";
import { FromSchema } from "json-schema-to-ts";
import { ServiceError } from "@/services/ServiceError";
import {
  ERROR_EMAIL_ALREADY_VERIFIED,
  ERROR_EMAIL_NOT_VERIFIED,
  ERROR_INVALID_CHANGE_PASSWORD_CODE,
  ERROR_INVALID_PASSWORD,
  ERROR_INVALID_VERIFY_EMAIL_CODE,
  ERROR_USER_ALREADY_EXISTS,
  ERROR_USER_NOT_FOUND,
} from "@/services/UserService";
import { UserDoc } from "@/models/User";

export const authController: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/info",
    { preHandler: fastify.auth([fastify.verifyAuth]) },
    async (request) => {
      const { name, email } = request.user as UserDoc;
      return { name, email };
    }
  );

  fastify.post<{ Body: FromSchema<typeof registerSchema.body> }>(
    "/register",
    { schema: registerSchema },
    async (request, reply) => {
      const { name, email, password } = request.body;

      let user;
      try {
        user = await fastify.services.userService.createUser({
          name,
          email,
          password,
        });
      } catch (e) {
        if (e instanceof ServiceError && e.code === ERROR_USER_ALREADY_EXISTS) {
          return reply.code(409).send({ code: errorCodes.userAlreadyExists });
        }
        throw e;
      }

      if (user.verifyEmailCode) {
        try {
          await fastify.services.mailService.sendEmailVerify(email, {
            code: user.verifyEmailCode,
          });
        } catch (e) {
          fastify.log.error(e, "Mail not sent");
        }
      }

      return { id: user.id };
    }
  );

  fastify.post<{ Body: FromSchema<typeof loginSchema.body> }>(
    "/login",
    { schema: loginSchema },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const token = await fastify.services.userService.login(email, password);
        return { token };
      } catch (e) {
        if (e instanceof ServiceError) {
          if (e.code === ERROR_INVALID_PASSWORD) {
            return reply.code(401).send({ code: errorCodes.invalidPassword });
          } else if (e.code === ERROR_USER_NOT_FOUND) {
            return reply.code(401).send({ code: errorCodes.userNotFound });
          } else if (e.code === ERROR_EMAIL_NOT_VERIFIED) {
            return reply.code(401).send({ code: errorCodes.emailNotVerified });
          }
        }
        throw e;
      }
    }
  );

  fastify.post<{ Body: FromSchema<typeof verifyEmailSchema.body> }>(
    "/verify-email",
    { schema: verifyEmailSchema },
    async (request, reply) => {
      const { code } = request.body;
      try {
        await fastify.services.userService.verifyUserEmail(code);
        return {};
      } catch (e) {
        if (
          e instanceof ServiceError &&
          e.code === ERROR_INVALID_VERIFY_EMAIL_CODE
        ) {
          return reply
            .code(400)
            .send({ code: errorCodes.invalidEmailVerifyCode });
        }
        throw e;
      }
    }
  );

  fastify.post<{ Body: FromSchema<typeof resendVerifyEmailSchema.body> }>(
    "/resend-verify-email",
    { schema: resendVerifyEmailSchema },
    async (request, reply) => {
      const { email, password } = request.body;

      let user;
      try {
        user = await fastify.services.userService.recreateUserVerifyEmailCode(
          email,
          password
        );
      } catch (e) {
        if (e instanceof ServiceError) {
          if (e.code === ERROR_INVALID_PASSWORD) {
            return reply.code(401).send({ code: errorCodes.invalidPassword });
          } else if (e.code === ERROR_USER_NOT_FOUND) {
            return reply.code(401).send({ code: errorCodes.userNotFound });
          } else if (e.code === ERROR_EMAIL_ALREADY_VERIFIED) {
            return reply
              .code(409)
              .send({ code: errorCodes.emailAlreadyVerified });
          }
        }
        throw e;
      }

      if (user.verifyEmailCode) {
        try {
          await fastify.services.mailService.sendEmailVerify(email, {
            code: user.verifyEmailCode,
          });
        } catch (e) {
          fastify.log.error(e, "Mail not sent");
        }
      }
      return {};
    }
  );

  fastify.post<{ Body: FromSchema<typeof resetPasswordSchema.body> }>(
    "/reset-password",
    { schema: resetPasswordSchema },
    async (request, reply) => {
      const { email } = request.body;

      let user;
      try {
        user = await fastify.services.userService.recreateUserChangePasswordCode(
          email
        );
      } catch (e) {
        if (e instanceof ServiceError && e.code === ERROR_USER_NOT_FOUND) {
          return reply.code(401).send({ code: errorCodes.userNotFound });
        }
        throw e;
      }

      if (user.changePasswordCode) {
        try {
          await fastify.services.mailService.sendChangePasswordCode(email, {
            code: user.changePasswordCode,
          });
        } catch (e) {
          fastify.log.error(e, "Mail not sent");
        }
      }
      return {};
    }
  );

  fastify.post<{ Body: FromSchema<typeof changePasswordSchema.body> }>(
    "/change-password",
    { schema: changePasswordSchema },
    async (request, reply) => {
      const { code, password } = request.body;
      try {
        await fastify.services.userService.changeUserPasswordByCode(
          code,
          password
        );
        return {};
      } catch (e) {
        if (
          e instanceof ServiceError &&
          e.code === ERROR_INVALID_CHANGE_PASSWORD_CODE
        ) {
          return reply
            .code(400)
            .send({ code: errorCodes.invalidChangePasswordCode });
        }
        throw e;
      }
    }
  );
};
