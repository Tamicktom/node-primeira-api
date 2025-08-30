//* Libraries imports
import fastify from 'fastify';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";

//* Routes imports
import { getCourses } from './routes/get-courses.ts';
import { createCourse } from './routes/create-course.ts';
import { getCourseById } from './routes/get-course-by-id.ts';

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

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Desafio Node.js",
      version: "1.0.0",
    }
  },
  transform: jsonSchemaTransform,
});

app.register(fastifyScalar, {
  routePrefix: "/swagger",
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getCourses);
app.register(createCourse);
app.register(getCourseById);

export { app };