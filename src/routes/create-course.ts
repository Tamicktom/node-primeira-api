//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

//* Local imports
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const createCourse: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/courses",
    {
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
          }),
        }
      }
    }, async (req, res) => {
      const result = await db
        .insert(coursesTable)
        .values({
          title: req.body.title,
          description: req.body.description,
        })
        .returning({
          id: coursesTable.id,
        })

      return res.status(201).send(result[0]);
    }
  );
};