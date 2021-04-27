import Fastify from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
const dist = path.resolve(process.cwd(), "./dist");

const server = Fastify({ logger: true });

server.register(fastifyStatic, {
  root: path.join(dist, "client/assets"),
  prefix: `/assets/`,
});

const start = async () => {
  const {
    // ssr: { assets },
    main,
  } = await import(`${dist}/server/package.json`);
  const manifest = await import(`${dist}/client/ssr-manifest.json`);
  const { default: renderPage } = await import(`${dist}/server/${main}`);

  server.get("/favicon.ico", async (request, reply) => {
    return reply.sendFile("favicon.ico");
  });

  server.get("/*", async (request, reply) => {
    const { html } = await renderPage(request.url, {
      manifest,
      preload: true,
    });
    return reply.type("text/html").send(html);
  });

  try {
    await server.listen(3000, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
