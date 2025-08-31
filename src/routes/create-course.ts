//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

//* Hooks imports
import { checkRequestJwt } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

//* Local imports
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const createCourse: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/courses",
    {
      preHandler: [checkRequestJwt, checkUserRole(["admin"])],
      schema: {
        tags: ["courses"],
        summary: "Create a new course",
        body: z.object({
          title: z.string().describe("The title of the course"),
          description: z.string().describe("The description of the course"),
        }),
        response: {
          201: z.object({
            id: z.uuid().describe("The id of the course"),
            title: z.string().describe("The title of the course"),
            description: z.string().describe("The description of the course"),
          }),
        }
      }
    },
    async (req, res) => {
      const result = await db
        .insert(coursesTable)
        .values({
          title: req.body.title,
          description: req.body.description,
        })
        .returning({
          id: coursesTable.id,
          title: coursesTable.title,
          description: coursesTable.description,
        })

      return res.status(201).send(result[0]);
    }
  );
};