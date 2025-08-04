import { faker } from '@faker-js/faker';
import { db } from '..';
import { courses } from '../schema';

const instructorIds = [
  'a8b5dbd9-d9b9-4ae8-b5f9-da491c33db2d',
  '21f972f5-ed81-4b7f-b464-e02820aca250',
  'f6c2870e-2cd5-4729-8236-d1ebad9efbd3',
  'b452544e-ab7a-47f8-a1bd-707fcf5d89a9',
  '2fad2726-f7e8-4ccb-8c37-e7301f590653',
  '6a4d16c4-7c90-4c06-ae39-b8188bf532ec',
  '0faca5b7-2ae8-4edc-8a65-24598de4d77b',
  'ec8f72b7-aa89-469f-9ad9-298d9397caeb',
  '08b4c69d-1330-4429-981f-210a82133399',
  'c6306b2e-e356-4b17-bc22-6f0bc2c7a3e8',
];

async function seedCourses() {
  for (let i = 0; i < instructorIds.length; i++) {
    const title = faker.lorem.words(3);
    const description = faker.lorem.paragraph();
    const instructorId = instructorIds[i];

    const [course] = await db
      .insert(courses)
      .values({
        title,
        description,
        instructorId,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log(
      `Course ${i + 1} created with ID ${course.id} for instructor ${instructorId}`
    );
  }
}

seedCourses()
  .then(() => {
    console.log('All courses seeded.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding courses:', err);
    process.exit(1);
  });
