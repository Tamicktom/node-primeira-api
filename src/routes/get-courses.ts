//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

//* Local imports
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const getCourses: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all courses",
        response: {
          200: z.array(z.object({
            id: z.uuid().describe("The id of the course"),
            title: z.string().describe("The title of the course"),
          })),
        }
      }
    },
    async (req, res) => {
      const result = await db
        .select({
          id: coursesTable.id,
          title: coursesTable.title,
        })
        .from(coursesTable)
        .orderBy(coursesTable.createdAt)
        .limit(10);

      res.send(result);
    }
  );
};