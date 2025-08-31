//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";
import { hash } from "argon2";

//* Local imports
import { db } from "./client.ts";
import { usersTable, coursesTable, enrollmentsTable } from "./schema.ts";

const USER_COUNT = 10;
const COURSE_COUNT = 10;

const DEFAULT_USER_PASSWORD = "123123";

async function generateUsers() {
  return await Promise.all(Array.from({ length: USER_COUNT }, async () => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(DEFAULT_USER_PASSWORD),
      role: "student" as const,
    };
  }));
}

async function generateCourses() {
  return await Promise.all(Array.from({ length: COURSE_COUNT }, async () => {
    return {
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
    }
  }));
}

async function seed() {

  console.log("😊 Starting seed...");

  const [usersData, coursesData] = await Promise.all([
    generateUsers(),
    generateCourses(),
  ]);

  await db.transaction(async (tx) => {
    console.log("👥 Creating users and courses...");

    const [users, courses] = await Promise.all([
      tx.insert(usersTable).values(usersData).returning(),
      tx.insert(coursesTable).values(coursesData).returning(),
    ]);

    const userIds = users.map((user) => user.id);
    const courseIds = courses.map((course) => course.id);

    console.log(`🔗 Creating ${userIds.length} enrollments...`);

    const enrollments = userIds.map((userId) => {
      const courseId = courseIds[Math.floor(Math.random() * courseIds.length)];
      return {
        userId,
        courseId,
      };
    });

    await tx.insert(enrollmentsTable).values(enrollments);
  });

  console.log("🎉 Seed completed!");

  process.exit(0);
}

seed();