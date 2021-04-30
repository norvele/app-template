import { FastifyAuthFunction } from "fastify-auth";

const ERROR_MISSING_AUTHORIZATION_TOKEN = "MissingAuthorizationToken";
const ERROR_INVALID_AUTHORIZATION_TOKEN = "InvalidAuthorizationToken";

export const verifyAuth: FastifyAuthFunction = async function verifyAuth(
  request,
  reply
) {
  const { authorization } = request.headers;
  if (!authorization) {
    return reply.code(401).send({ code: ERROR_MISSING_AUTHORIZATION_TOKEN });
  }
  const token = authorization.split(" ")[1];
  try {
    const { id } = await this.services.userService.verifyUserAccessToken(token);
    request.user = await this.services.userService.getUserById(id);
  } catch (e) {
    return reply.code(401).send({ code: ERROR_INVALID_AUTHORIZATION_TOKEN });
  }
};
