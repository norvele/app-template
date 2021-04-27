import Fastify from "fastify";
import fastifyEnv from "fastify-env";

const server = Fastify({ logger: true });
server.register(fastifyEnv, {
  confKey: "config",
  schema: {
    type: "object",
    required: ["DB_CONNECTION_STRING"],
    properties: {
      DB_CONNECTION_STRING: {
        type: "string",
      },
    },
  },
});

const start = async () => {
  server.get("/health-check", async (request, reply) => {
    return reply.send({ iAmAlive: true });
  });

  try {
    await server.listen(3001, "0.0.0.0");
    server.log.info(server.config);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
