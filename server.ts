//* Libraries imports
import fastify from 'fastify';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';

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
});

app.get('/', (req, res) => {
  console.log(req.ip);
  res.send('Hello World');
});

app.get("/courses", async (req, res) => {
  const courses = await db.select().from(coursesTable);
  res.send(courses);
});

app.get("/courses/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  const result = await db.select().from(coursesTable).where(eq(coursesTable.id, id));

  if (result.length > 0) {
    return res.send(result[0]);
  };

  return res.status(404).send({ message: 'Course not found' });
});

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});