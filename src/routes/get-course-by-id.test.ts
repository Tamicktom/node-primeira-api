//* Libraries imports
import { describe, it, expect } from "vitest";
import request from "supertest";
import { fakerPT_BR as faker } from "@faker-js/faker";

//* Local imports
import { app } from "../app.ts";

describe("get a course by id", async () => {
  it("should get a course by id", async () => {
    // first create a course
    await app.ready();

    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();

    //* Create a course
    const createCourseResponse = await request(app.server)
      .post("/courses")
      .set("Content-Type", "application/json")
      .send({
        title,
        description,
      });

    //* Get the course by id
    const url = `/courses/${createCourseResponse.body.id}`;
    const getCourseByIdResponse = await request(app.server)
      .get(url)
      .set("Content-Type", "application/json");

    expect(getCourseByIdResponse.status).toBe(200);
    expect(getCourseByIdResponse.body.id).toBe(createCourseResponse.body.id);
    expect(getCourseByIdResponse.body.title).toBe(title);
    expect(getCourseByIdResponse.body.description).toBe(description);

    await app.close();
  });
});