//* Libraries imports
import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

type JWTPayload = {
  sub: string;
  role: "student" | "admin";
  iat: number;
}

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
    const payload = jwt.verify(normalized, process.env.JWT_SECRET!) as JWTPayload;

    if (!payload) {
      console.log("Token is invalid");
      return reply.status(401).send({ message: "Unauthorized" });
    }

    request.user = payload;
  } catch (error) {
    console.log("Error verifying token", error);
    return reply.status(401).send({ message: "Unauthorized" });
  }
}