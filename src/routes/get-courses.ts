//* Libraries imports
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { asc, desc, ilike, or } from "drizzle-orm";
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
          search: z.string().default("").describe("Search query"),
          limit: z.coerce.number().default(10).describe("Limit of results"),
          offset: z.coerce.number().default(0).describe("Offset of results"),
          orderBy: z.enum(["title", "createdAt"]).default("createdAt").describe("Field to order by"),
          order: z.enum(["asc", "desc"]).default("asc").describe("Order direction"),
        }),
        response: {
          200: z.object({
            data: z.array(z.object({
              id: z.uuid().describe("The id of the course"),
              title: z.string().describe("The title of the course"),
            })),
            total: z.number().describe("The total number of results"),
          }),
        }
      }
    },
    async (req, res) => {

      const orderBy = req.query.orderBy === "createdAt" ? coursesTable.createdAt : coursesTable.title;
      const order = req.query.order === "asc" ? asc : desc;

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
        .orderBy(order(orderBy))
        .limit(req.query.limit)
        .offset(req.query.offset);

      const total = await db
        .$count(coursesTable, or(
          ilike(coursesTable.title, `%${req.query.search}%`),
          ilike(coursesTable.description, `%${req.query.search}%`),
        ));

      res.send({
        data: result,
        total,
      });
    }
  );
};