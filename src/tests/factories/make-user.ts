//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
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