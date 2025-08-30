//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

//* Local imports
import { db } from "../../database/client.ts";
import { coursesTable } from "../../database/schema.ts";


export async function makeCourses(amount: number = 1) {
  const courses = [];

  for (let i = 0; i < amount; i++) {
    const title = faker.lorem.sentence(3) + randomUUID(); //* Add a random UUID to the title to avoid duplicates
    const description = faker.lorem.paragraph();

    const [course] = await db
      .insert(coursesTable)
      .values({
        title,
        description,
      })
      .returning({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
      });

    courses.push(course);
  }

  return courses;
}

export async function makeCourse() {
  return (await makeCourses(1))[0];
}