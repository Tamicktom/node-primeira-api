//* Libraries imports
import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

/**
 * Hook to check if the request has a valid JWT token
 */

export async function checkRequestJwt(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  try {
    // Normalize header: support both "Bearer <token>" and raw token
    const normalized = authHeader.trim().replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "");
    const isTokenValid = jwt.verify(normalized, process.env.JWT_SECRET!);

    if (!isTokenValid) {
      console.log("Token is invalid");
      return reply.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error verifying token", error);
    return reply.status(401).send({ message: "Unauthorized" });
  }
}