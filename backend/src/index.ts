import Fastify from "fastify";
import fp from "fastify-plugin";
import fastifyEnv from "fastify-env";
import fastifyCors from "fastify-cors";
import fastifyAuth from "fastify-auth";
import { authController } from "@/controllers/auth";
import { envSchema } from "@/schemas/env";
import * as mongoose from "mongoose";
import { MailService } from "@/services/MailService";
import { UserService } from "@/services/UserService";
import { verifyAuth } from "@/verifyAuth";

const server = Fastify({ logger: true });

server.register(fastifyEnv, {
  confKey: "config",
  schema: envSchema,
});
server.register(fastifyCors);
server.register(fastifyAuth);

server.register(
  fp(async (fastify) => {
    const mailService = new MailService({
      host: fastify.config.MAIL_HOST,
      port: fastify.config.MAIL_PORT,
      user: fastify.config.MAIL_USER,
      password: fastify.config.MAIL_PASS,
      from: fastify.config.MAIL_FROM,
    });
    const userService = new UserService();

    fastify.decorate(
      "services",
      {
        mailService,
        userService,
      },
      ["config"]
    );

    fastify.decorate("verifyAuth", verifyAuth);
    fastify.decorateRequest("user", null);
  })
);

server.register(async (fastify) => {
  const connectionString = fastify.config.DB_CONNECTION_STRING;
  mongoose.set("debug", true);
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    server.log.error(e);
  }
});

server.get("/health-check", async (request, reply) => {
  return reply.send({ iAmAlive: true });
});

server.register(authController, { prefix: "/auth" });

const start = async () => {
  try {
    await server.listen(3001, "0.0.0.0");
    server.log.info(server.config);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
