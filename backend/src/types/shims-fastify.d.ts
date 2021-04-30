// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { envSchema } from "@/schemas/env";
import { MailService } from "@/services/MailService";
import { UserService } from "@/services/UserService";
import { FastifyAuthFunction } from "fastify-auth";
import { UserDoc } from "@/models/User";

declare module "fastify" {
  interface FastifyInstance {
    config: FromSchema<typeof envSchema>;
    services: {
      mailService: MailService;
      userService: UserService;
    };
    verifyAuth: FastifyAuthFunction;
  }

  interface FastifyRequest {
    user?: UserDoc | null;
  }
}
