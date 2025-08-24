//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { eq } from "drizzle-orm";
import { z } from "zod";

//* Local imports
import { db } from "../database/client.ts";
import { coursesTable } from "../database/schema.ts";

export const getCourseById: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Get a course by id",
        params: z.object({
          id: z.uuid().describe("The id of the course"),
        }),
        response: {
          200: z.object({
            id: z.uuid().describe("The id of the course"),
            title: z.string().describe("The title of the course"),
          }),
          404: z.object({
            message: z.string().describe("The message of the error"),
          }),
        }
      }
    },
    async (req, res) => {
      const result = await db
        .select()
        .from(coursesTable)
        .where(
          eq(coursesTable.id, req.params.id)
        );

      if (result.length > 0) {
        return res.send(result[0]);
      };

      return res.status(404).send({ message: 'Course not found' });
    }
  );
};