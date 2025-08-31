//* Libraries imports
import { FastifyRequest } from "fastify";

export function getAuthenticatedUserFromRequest(request: FastifyRequest) {
  const { user } = request;

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
}