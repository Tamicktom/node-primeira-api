//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import request from "supertest";

//* Local imports
import { app } from "../app.ts";
import { makeUser } from "./factories/make-user.ts";

describe("login with valid data", async () => {

  it("should login with valid data", async () => {
    await app.ready();
    //* Create a user
    const user = await makeUser();

    //* Create a course
    const url = "/sessions";
    const response = await request(app.server)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        email: user.email,
        password: user.passwordBeforeHash,
      });

    expect(response.status).toBe(200);

    await app.close();
  });

});