//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import request from "supertest";

//* Local imports
import { app } from "../app.ts";

describe("create an course with valid data", async () => {
  it("should create an course with valid data", async () => {
    await app.ready();

    //* Create a course
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const url = "/courses";
    const response = await request(app.server)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        title,
        description
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(title);
    expect(response.body.description).toBe(description);

    await app.close();
  });
});