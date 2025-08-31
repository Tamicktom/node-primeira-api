//* Libraries imports
import { describe, it, expect } from "vitest";
import request from "supertest";

//* Local imports
import { app } from "../app.ts";
import { makeCourses } from "./factories/make-course.ts";
import { makeAuthenticatedUser } from "./factories/make-user.ts";

describe("get all courses", async () => {

  it("should get all courses with search", async () => {
    await app.ready();

    //* Make an authenticated user
    const user = await makeAuthenticatedUser("student");

    const courses = await makeCourses(3);

    await Promise.all(courses.map(async (course) => {
      const url = `/courses?search=${course.title}`;
      const getCoursesResponse = await request(app.server)
        .get(url)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${user.token}`);

      expect(getCoursesResponse.status).toBe(200);
      expect(getCoursesResponse.body.data.length).toBe(1);
      expect(getCoursesResponse.body.data[0].id).toBe(course.id);
      expect(getCoursesResponse.body.data[0].title).toBe(course.title);
      expect(getCoursesResponse.body.data[0].enrolled).toBe(0);
      expect(getCoursesResponse.body.total).toBe(1);
    }));

    await app.close();
  });
});