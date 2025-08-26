//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ilike, or } from "drizzle-orm";
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
        querystring: z.object({
          search: z.string().default(""),
          limit: z.coerce.number().default(10),
          offset: z.coerce.number().default(0),
        }),
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
        .where(
          or(
            ilike(coursesTable.title, `%${req.query.search}%`),
            ilike(coursesTable.description, `%${req.query.search}%`),
          )
        )
        .orderBy(coursesTable.createdAt)
        .limit(req.query.limit)
        .offset(req.query.offset);

      res.send(result);
    }
  );
};