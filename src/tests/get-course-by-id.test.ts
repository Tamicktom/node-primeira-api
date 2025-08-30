//* Libraries imports
import { describe, it, expect } from "vitest";
import request from "supertest";

//* Local imports
import { app } from "../app.ts";
import { makeCourse } from "./factories/make-course.ts";

describe("get a course by id", async () => {

  it("should get a course by id", async () => {
    await app.ready();

    // first create a course
    const course = await makeCourse();

    //* Get the course by id
    const url = `/courses/${course.id}`;
    const getCourseByIdResponse = await request(app.server)
      .get(url)
      .set("Content-Type", "application/json");

    expect(getCourseByIdResponse.status).toBe(200);
    expect(getCourseByIdResponse.body.id).toBe(course.id);
    expect(getCourseByIdResponse.body.title).toBe(course.title);
    expect(getCourseByIdResponse.body.description).toBe(course.description);

    await app.close();
  });
});