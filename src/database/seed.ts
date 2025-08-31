//* Libraries imports
import { fakerPT_BR as faker } from "@faker-js/faker";

//* Local imports
import { db } from "./client.ts";
import { usersTable, coursesTable, enrollmentsTable } from "./schema.ts";

const USER_COUNT = 100;
const COURSE_COUNT = 10;

function generateUsers(): { name: string, email: string, password: string, role: "student" | "admin" }[] {
  return Array.from({ length: USER_COUNT }, () => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "student" as const,
    };
  });
}

function generateCourses(): { title: string, description: string }[] {
  return Array.from({ length: COURSE_COUNT }, () => {
    return {
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
    }
  });
}

async function seed() {

  console.log("😊 Starting seed...");

  const usersData = generateUsers();
  const coursesData = generateCourses();

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