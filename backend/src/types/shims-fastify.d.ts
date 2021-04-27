import { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      DB_CONNECTION_STRING: string;
    };
  }
}
