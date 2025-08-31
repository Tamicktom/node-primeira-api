//* Libraries imports
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
  });

  it("shouln't login with invalid email", async () => {
    await app.ready();
    //* Create a user
    const user = await makeUser();

    //* Create a course
    const url = "/sessions";
    const response = await request(app.server)
      .post(url)
      .set("Content-Type", "application/json")
      .send({
        email: "invalid_email@example.com",
        password: user.passwordBeforeHash,
      });

    expect(response.status).toBe(401);
  });

  it("shouln't login with invalid password", async () => {
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
        password: "invalid_password",
      });

    expect(response.status).toBe(401);
  });

});