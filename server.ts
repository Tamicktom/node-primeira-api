//* Libraries imports
import fastify from 'fastify';
import crypto from 'node:crypto';

const app = fastify();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});