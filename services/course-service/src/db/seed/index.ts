import { faker } from '@faker-js/faker';
import slugify from 'slugify';
import { db } from '../index';
import {
  categories as categoriesTable,
  courses,
  lessons,
  lessonTypeEnum,
  modules,
  textLessonContent,
} from '../schema';

const hardcodedInstructorIds = [
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

const realHlsUrls = [
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8',
  'https://ireplay.tv/test/blender.m3u8',
  'https://res.cloudinary.com/dannykeane/video/upload/sp_full_hd/q_80:qmax_90,ac_none/v1/dk-memoji-dark.m3u8',
];

async function seedCategories() {
  const categoryNames = [
    'gRPC',
    'cloud-computing',
    'Web Dev',
    'Development',
    'Design',
    'Marketing',
    'Business',
    'AI',
    'Data Science',
  ];

  const categoryData = categoryNames.map((name) => ({
    name,
    slug: slugify(name, { lower: true, strict: true }),
  }));

  await db.insert(categoriesTable).values(categoryData).onConflictDoNothing();

  const allCategories = await db.select().from(categoriesTable);

  console.log(`Seeded or reused ${allCategories.length} categories.`);

  return allCategories;
}

async function seedCourses(categories: { id: string }[]): Promise<string[]> {
  if (!categories.length) throw new Error('No categories found.');

  const instructorIds =
    hardcodedInstructorIds.length > 0
      ? hardcodedInstructorIds
      : Array.from({ length: 10 }, () => faker.string.uuid());

  const courseIds: string[] = [];

  for (const instructorId of instructorIds) {
    const randomCategory = faker.helpers.arrayElement(categories);

    const [course] = await db
      .insert(courses)
      .values({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        instructorId,
        categoryId: randomCategory.id,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    courseIds.push(course.id);
    console.log(`Course created: ${course.title} (ID: ${course.id})`);
  }

  return courseIds;
}

async function seedModules(courseIds: string[]): Promise<string[]> {
  const moduleIds: string[] = [];

  for (const courseId of courseIds) {
    const moduleCount = faker.number.int({ min: 4, max: 6 });

    for (let i = 0; i < moduleCount; i++) {
      const [module] = await db
        .insert(modules)
        .values({
          title: faker.company.catchPhrase(),
          courseId,
          order: i,
        })
        .returning();

      moduleIds.push(module.id);
      console.log(`Module created: ${module.title} (Course: ${courseId})`);
    }
  }

  return moduleIds;
}

async function seedLessons(moduleIds: string[]) {
  const LESSONS_PER_MODULE = 10;

  for (const moduleId of moduleIds) {
    for (let i = 0; i < LESSONS_PER_MODULE; i++) {
      const title = faker.lorem.sentence(5);
      const lessonType = faker.helpers.arrayElement([
        'video',
        'text',
        'quiz',
      ]) as (typeof lessonTypeEnum.enumValues)[number];

      let contentId: string | null = null;

      if (lessonType === 'video') {
        contentId = faker.helpers.arrayElement(realHlsUrls);
      }

      if (lessonType === 'quiz') {
        const quiz = {
          question: faker.lorem.sentence(),
          options: [
            faker.lorem.word(),
            faker.lorem.word(),
            faker.lorem.word(),
            faker.lorem.word(),
          ],
          answerIndex: faker.number.int({ min: 0, max: 3 }),
        };
        contentId = JSON.stringify(quiz);
      }

      const [lesson] = await db
        .insert(lessons)
        .values({
          title,
          moduleId,
          order: i + 1,
          lessonType,
          contentId,
        })
        .returning();

      console.log(`Lesson ${i + 1} [${lessonType}] created (ID: ${lesson.id})`);

      if (lessonType === 'text') {
        const content = faker.lorem.paragraphs(3);
        await db.insert(textLessonContent).values({
          lessonId: lesson.id,
          content,
        });
      }
    }
  }

  console.log('Lessons seeding complete!');
}

async function runSeed() {
  try {
    console.log('Starting full DB seed...');

    const seededCategories = await seedCategories();
    const courseIds = await seedCourses(seededCategories);
    const moduleIds = await seedModules(courseIds);
    await seedLessons(moduleIds);

    console.log('All data seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

runSeed();
