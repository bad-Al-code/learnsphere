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

const hardcodedInstructorIds = [
  '410e8e92-6056-484a-beb6-803218bd3574',
  'b06531a1-2563-4702-8706-819ce72649ac',
  'e12aefe0-858c-47b1-8a26-3c5fd95f6bbd',
  'b6a767f5-d082-4ee3-b019-5d2a79adeb2b',
  '83e335fe-86b3-4067-8f35-938cf2d29797',
  '7c9b385c-4d43-448d-90e9-dd67ae7a65e3',
  '64d31b63-a2a9-4435-89a0-b2f39770bf40',
  '4cf07d2a-77d8-4ce1-90c0-47312c3fa98c',
  '3eae3397-462f-42b6-90d3-c9ea12634bf0',
  'c5020261-df8e-4043-9569-958ab630f493',
  'c2adbb12-b761-4850-88a4-167cd71531c2',
  '6843a353-8d43-45d9-8aa6-82400fff62e7',
  '2637a5e2-fd67-4bf3-8378-d72b443c289a',
  'a570621c-99e4-42c4-b817-703bc1c8214b',
  '8d58d3a0-a8f0-40e8-bd2e-bb00a3eacaf3',
  '19e9a170-f693-44b2-a199-f704a48d18a5',
  'a4ac9301-1f45-494b-b6f5-fb0b14761587',
  'f794a5ef-ac49-43e1-ba9b-2a14f436b194',
  'a4c4efbe-afeb-4e56-8192-1d10e61b6b2f',
  'f2345c7b-3caa-44e0-b435-b219c32ef68f',
  'a11b42c7-20ac-4477-9e30-a56e4cd85bd6',
  'afd0f6b8-ba26-4863-84b6-1c4c5dd82696',
  '58748311-f283-49a6-9fa9-8b13233186cf',
  '47bd4b62-7a33-490c-97c5-67a2c7c0e334',
  '7952b0a7-174b-4a1c-82ff-63cefae471ee',
  '0ea9cc9c-5074-4087-ba91-35305b272077',
  '29c20e2c-acc4-46fe-b9b7-119d3c99225c',
  '5d444627-54b7-48cd-bf95-6029abacdb92',
  '4e9c5de5-aecb-434a-9bab-6e060a43c2c2',
  'c4d05692-36f2-450a-853d-7d75abdadf9f',
  '89bb3f5e-8560-4006-9fd9-f81ca76c09d1',
  '7ef146b1-8c58-4b29-9094-18b4e720afce',
  'd4f5c0d3-6ae3-4d77-8196-bb99a9e59a9c',
  '775eeb47-0347-4968-8f4f-5cee56989d7b',
  'd17c8e5c-8273-4c23-843f-2b2f6a04e235',
  'b9b2f5e4-29af-4288-aa19-a95cd661411a',
  'd58cf465-8dd8-4074-bc52-1a3834f42de1',
  '8b9be022-628d-4d73-92ed-454766593c21',
  '51634ebe-9e05-4630-9532-33322f460abe',
  '3df315b7-ba99-4b2c-abe4-48fef5b914f0',
  '4207bf87-b84c-48ce-a79f-26c0eac54a43',
  'b921a9f4-87e0-4fc4-b281-66c607aa1041',
  'aa45ab83-b93a-4235-9c3a-25bd32d0c7bf',
  '5157aa6f-229f-4101-8421-0062c0375cb8',
  'c7940225-f0de-4e30-a689-fe0cfb38b65d',
  '902050cd-ce4e-4b96-b18f-e647ee6fc139',
  '7ea14fa1-ecdb-48f1-a16c-3454b22a84d0',
  'b652a94c-8057-4a45-8af7-73a39597d2dc',
  '22cf96b7-97b3-4544-8104-a49e3a73c937',
  '1f6201e3-1755-4626-b3bb-9a9273c83e28',
  'e3b3bc3c-e271-4fad-b3b7-ae9e6b44daed',
  'e3b3bc3c-e271-4fad-b3b7-ae9e6b44daed',
  'e3b3bc3c-e271-4fad-b3b7-ae9e6b44daed',
  'e3b3bc3c-e271-4fad-b3b7-ae9e6b44daed',
  'e3b3bc3c-e271-4fad-b3b7-ae9e6b44daed',
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

  const courseLevels = [
    'beginner',
    'intermediate',
    'advanced',
    'all-levels',
  ] as const;
  const courseStatus = ['draft', 'published'] as const;
  const courseIds: string[] = [];

  for (const instructorId of hardcodedInstructorIds) {
    const randomCategory = faker.helpers.arrayElement(categories);
    const price = faker.number
      .float({ min: 499, max: 2999, fractionDigits: 2 })
      .toString();

    const [course] = await db
      .insert(courses)
      .values({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        instructorId,
        status: faker.helpers.arrayElement(courseStatus),
        categoryId: randomCategory.id,
        level: faker.helpers.arrayElement(courseLevels),
        imageUrl: `https://picsum.photos/600/400?random=${Math.random()}`,
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

    courseIds.push(course.id);

    try {
      const publisher = new CourseCreatedPublisher();
      await publisher.publish({
        courseId: course.id,
        instructorId: course.instructorId,
        status: course.status,
        prerequisiteCourseId: course.prerequisiteCourseId ?? null,
        price: course.price,
        currency: course.currency,
      });

      console.log(`Published course.created for course ${course.id}`);
    } catch (err) {
      console.error(`Failed to publish course.created for ${course.id}:`, err);
    }

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

async function seedAssignments(moduleIds: string[]): Promise<void> {
  for (const moduleId of moduleIds) {
    const [parentModule] = await db
      .select({ courseId: modules.courseId })
      .from(modules)
      .where(eq(modules.id, moduleId));
    if (!parentModule) continue;

    const assignmentCount = faker.number.int({ min: 2, max: 4 });

    for (let i = 0; i < assignmentCount; i++) {
      const title = `Assignment ${i + 1}: ${faker.lorem.words(3)}`;
      const description = faker.lorem.sentence();
      const status = faker.helpers.arrayElement(
        assignmentStatusEnum.enumValues
      );
      const dueDate = faker.date.future({ years: 0.5 });

      await db.insert(assignments).values({
        title,
        description,
        moduleId,
        courseId: parentModule.courseId,
        order: i,
        status,
        dueDate,
      });

      console.log(`Assignment created: ${title} (Module: ${moduleId})`);
    }
  }
  console.log('Assignments seeding complete!');
}

async function seedResources(courseIds: string[]): Promise<void> {
  for (const courseId of courseIds) {
    const resourceContent = faker.number.int({ min: 1, max: 10 });

    for (let i = 0; i < resourceContent; i++) {
      const fileName = faker.system.commonFileName('pdf');

      await db.insert(resources).values({
        title: faker.lorem.words({ min: 3, max: 10 }),
        courseId,
        fileUrl: faker.helpers.arrayElement(sampleFileUrls),
        fileName: fileName,
        fileSize: faker.number.int({ min: 100_000, max: 1_000_000 }),
        fileType: 'application/pdf',
        order: i,
      });

      console.log(`Resource created: ${fileName} (Course: ${courseId})`);
    }
  }

  console.log('Resources seeding complete!');
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSeed() {
  try {
    console.log('Starting full DB seed...');
    await rabbitMQConnection.connect();

    // await db.delete(resources);
    //     await db.delete(assignments);
    //     await db.delete(textLessonContent);
    //     await db.delete(lessons);
    //     await db.delete(modules);
    //     await db.delete(courses);
    //     await db.delete(categoriesTable);
    // console.log('Cleared existing course data.');

    const seededCategories = await seedCategories();
    const courseIds = await seedCourses(seededCategories);
    const moduleIds = await seedModules(courseIds);
    await seedLessons(moduleIds);
    await seedAssignments(moduleIds);
    await seedResources(courseIds);

    console.log('All data seeded successfully.');

    console.log('Waiting for events to publish...');
    await delay(2000);

    await rabbitMQConnection.close();

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);

    await rabbitMQConnection.close().catch(console.error);
    process.exit(1);
  }
}

runSeed();
