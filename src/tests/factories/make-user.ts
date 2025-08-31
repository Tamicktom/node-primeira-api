//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { hash } from "argon2";

//* Local imports
import { db } from "../../database/client.ts";
import { usersTable } from "../../database/schema.ts";

/**
 * Make users and return an array of users with the original password
 */

export async function makeUsers(amount: number = 1) {
  return await Promise.all(
    Array.from(
      { length: amount },
      async () => {
        const passwordBeforeHash = faker.internet.password();

        const [user] = await db
          .insert(usersTable)
          .values({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: await hash(passwordBeforeHash),
            role: "student",
          })
          .returning({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
          });

        const newUser = {
          ...user,
          passwordBeforeHash,
        }

        return newUser;
      }
    )
  );
}

/**
 * Make a user and return the user with the original password
 */

export async function makeUser() {
  return (await makeUsers(1))[0];
}

/**
 * Make an authenticated user and return the user with the original password
 */

export async function makeAuthenticatedUser(role: "student" | "admin") {
  const passwordBeforeHash = faker.internet.password();

  const [user] = await db
    .insert(usersTable)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordBeforeHash),
      role,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      password: usersTable.password,
    });

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
  );

  const newUser = {
    ...user,
    passwordBeforeHash,
    token,
  }

  return newUser;
}