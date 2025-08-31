//* Libraries imports
import type { FastifyRequest, FastifyReply } from "fastify";

//* Local imports
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

/**
 * Hook to check if the request has a valid JWT token
 */

export function checkUserRole(role: ("student" | "admin")[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getAuthenticatedUserFromRequest(request);

    if (!role.includes(user.role)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  }
}