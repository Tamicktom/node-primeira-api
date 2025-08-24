//* Libraries imports
import fastify from 'fastify';
import { eq } from 'drizzle-orm';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';

//* Local imports
import { db } from './src/database/client.ts';
import { coursesTable } from './src/database/schema.ts';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', (req, res) => {
  console.log(req.ip);
  res.send('Hello World');
});

app.get(
  "/courses",
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

app.get(
  "/courses/:id",
  {
    schema: {
      params: z.object({
        id: z.uuid(),
      })
    }
  },
  async (req, res) => {
    const result = await db.select().from(coursesTable).where(eq(coursesTable.id, req.params.id));

    if (result.length > 0) {
      return res.send(result[0]);
    };

    return res.status(404).send({ message: 'Course not found' });
  }
);

app.post(
  "/courses",
  {
    schema: {
      body: z.object({
        title: z.string(),
        description: z.string(),
      })
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

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});