import { faker } from '@faker-js/faker';
import { db } from '../index';
import { lessons, lessonTypeEnum, modules, textLessonContent } from '../schema';

export async function getAllModuleIds(): Promise<string[]> {
  const moduleRecords = await db.select({ id: modules.id }).from(modules);
  return moduleRecords.map((m) => m.id);
}

const LESSONS_PER_MODULE = 10;

const realHlsUrls = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/gear4/prog_index.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  'https://mojenjem.com/hls/movie.m3u8',
];

async function seedLessons() {
  const moduleIds = await getAllModuleIds();
  console.log(`Seeding lessons for ${moduleIds.length} modules...`);

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

      console.log(
        `Lesson ${i + 1} [${lessonType}] created with ID: ${lesson.id} (Module: ${moduleId})`
      );

      if (lessonType === 'text') {
        const content = faker.lorem.paragraphs(3);
        await db.insert(textLessonContent).values({
          lessonId: lesson.id,
          content,
        });
      }
    }
  }

  console.log('Lesson seeding complete!');
}

seedLessons().catch((err) => {
  console.error('Error seeding lessons:', err);
});
