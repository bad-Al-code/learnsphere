import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { rabbitMQConnection } from '../../events/connection';
import { CourseCreatedPublisher } from '../../events/publisher';
import { db } from '../index';
import {
  assignments,
  assignmentStatusEnum,
  categories as categoriesTable,
  courses,
  lessons,
  lessonTypeEnum,
  modules,
  resources,
  textLessonContent,
} from '../schema';
import { hardcodedInstructorIds } from './ids';

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

const sampleFileUrls = [
  'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf', // ~142 KB
  'https://www.getsamplefiles.com/sample-1.pdf', // ~32 KB
  'https://www.getsamplefiles.com/sample-2.pdf', // ~222 KB
  'https://www.getsamplefiles.com/sample-4.pdf', // ~299 KB
  'https://www.getsamplefiles.com/sample-5.pdf', // ~1 MB (just under)
  'https://www.sample-files.com/documents/pdf/basic-text.pdf', // small text
  'https://www.sample-files.com/documents/pdf/sample-report.pdf', // small multi-page
  'https://www.sample-files.com/documents/pdf/fillable-form.pdf', // small form
  'https://www.sample-files.com/documents/pdf/image-doc.pdf', // small images
  'https://www.africau.edu/images/default/sample.pdf', // 13 KB
  'https://www.orimi.com/pdf-test.pdf', // ~36 KB
  'https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf', // ~800 KB
  'https://file-examples.com/storage/fe0b879da643f3e2c813c4e/2017/10/file-sample_150kB.pdf', // 150 KB
  'https://file-examples.com/storage/fe0b879da643f3e2c813c4e/2017/10/file-sample_500kB.pdf', // 500 KB
  'https://file-examples.com/storage/fe0b879da643f3e2c813c4e/2017/10/file-sample_700kB.pdf', // 700 KB
];

async function seedCategories() {
  const categoryNames = [
    'Web Development',
    'Data Science',
    'Cloud Computing',
    'Design',
    'Marketing',
    'Business',
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

async function seedCourses(categories: { id: string }[]) {
  if (!categories.length) throw new Error('No categories found.');
  const courseLevels = [
    'beginner',
    'intermediate',
    'advanced',
    'all-levels',
  ] as const;
  const courseStatus = ['draft', 'published'] as const;
  const createdCourses: (typeof courses.$inferSelect)[] = [];

  for (const instructorId of hardcodedInstructorIds) {
    const courseCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < courseCount; i++) {
      const price = faker.number
        .float({ min: 499, max: 2999, fractionDigits: 2 })
        .toString();
      const [course] = await db
        .insert(courses)
        .values({
          title: faker.lorem
            .words(3)
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          description: faker.lorem.paragraph(),
          instructorId,
          status: faker.helpers.arrayElement(courseStatus),
          categoryId: faker.helpers.arrayElement(categories).id,
          level: faker.helpers.arrayElement(courseLevels),
          imageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(5)}/600/400`,
          price: price,
          duration: faker.number.int({ min: 60, max: 600 }),
          averageRating: faker.number.float({
            min: 3.5,
            max: 5,
            fractionDigits: 1,
          }),
          enrollmentCount: faker.number.int({ min: 50, max: 1500 }),
          currency: 'INR',
        })
        .returning();
      createdCourses.push(course);
      console.log(
        `Created course: "${course.title}" for instructor ${instructorId}`
      );
    }
  }
  return createdCourses;
}

async function seedModules(createdCourses: (typeof courses.$inferSelect)[]) {
  const createdModules: (typeof modules.$inferSelect)[] = [];
  for (const course of createdCourses) {
    const moduleCount = faker.number.int({ min: 4, max: 8 });
    for (let i = 0; i < moduleCount; i++) {
      const [module] = await db
        .insert(modules)
        .values({
          title: `Module ${i + 1}: ${faker.company.catchPhrase()}`,
          courseId: course.id,
          order: i,
        })
        .returning();
      createdModules.push(module);
    }
  }
  console.log(`Seeded ${createdModules.length} total modules.`);
  return createdModules;
}

async function seedLessons(createdModules: (typeof modules.$inferSelect)[]) {
  for (const module of createdModules) {
    const lessonCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < lessonCount; i++) {
      const lessonType = faker.helpers.arrayElement(lessonTypeEnum.enumValues);
      const [lesson] = await db
        .insert(lessons)
        .values({
          title: faker.lorem.sentence(5),
          moduleId: module.id,
          order: i,
          lessonType,
          contentId:
            lessonType === 'video'
              ? faker.helpers.arrayElement(realHlsUrls)
              : null,
        })
        .returning();

      if (lesson.lessonType === 'text') {
        await db.insert(textLessonContent).values({
          lessonId: lesson.id,
          content: `<p>${faker.lorem.paragraphs(3, '<br/><br/>')}</p>`,
        });
      }
    }
  }
  console.log(`Seeded lessons for ${createdModules.length} modules.`);
}

async function seedExtras(createdCourses: (typeof courses.$inferSelect)[]) {
  for (const course of createdCourses) {
    const resourceCount = faker.number.int({ min: 4, max: 8 });
    const assignmentCount = faker.number.int({ min: 3, max: 6 });

    for (let i = 0; i < resourceCount; i++) {
      await db.insert(resources).values({
        courseId: course.id,
        title: `Resource ${i + 1}: ${faker.lorem.words(3)}`,
        fileUrl: faker.helpers.arrayElement(sampleFileUrls),
        fileName: faker.system.commonFileName('pdf'),
        fileSize: faker.number.int({ min: 100000, max: 2000000 }),
        fileType: 'application/pdf',
        order: i,
      });
    }

    const courseModules = await db
      .select({ id: modules.id })
      .from(modules)
      .where(eq(modules.courseId, course.id));
    if (courseModules.length > 0) {
      for (let i = 0; i < assignmentCount; i++) {
        await db.insert(assignments).values({
          courseId: course.id,
          moduleId: faker.helpers.arrayElement(courseModules).id,
          title: `Assignment ${i + 1}: ${faker.lorem.words(4)}`,
          description: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(assignmentStatusEnum.enumValues),
          order: i,
        });
      }
    }
  }
  console.log(
    `Seeded resources and assignments for ${createdCourses.length} courses.`
  );
}

async function publishEvents(createdCourses: (typeof courses.$inferSelect)[]) {
  const publisher = new CourseCreatedPublisher();
  console.log(`Publishing ${createdCourses.length} course.created events...`);
  for (const course of createdCourses) {
    await publisher.publish({
      courseId: course.id,
      instructorId: course.instructorId,
      status: course.status,
      prerequisiteCourseId: course.prerequisiteCourseId ?? null,
      title: course.title,
      price: course.price,
      currency: course.currency,
    });
  }
  console.log('All course.created events published.');
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for course-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing data...');
    await db.delete(resources);
    await db.delete(assignments);
    await db.delete(textLessonContent);
    await db.delete(lessons);
    await db.delete(modules);
    await db.delete(courses);
    await db.delete(categoriesTable);

    const seededCategories = await seedCategories();
    const seededCourses = await seedCourses(seededCategories);
    const seededModules = await seedModules(seededCourses);
    await seedLessons(seededModules);
    await seedExtras(seededCourses);

    await publishEvents(seededCourses);

    console.log('Course service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
