import { faker } from '@faker-js/faker';
import { db } from '.';
import { courses, enrollments } from './schema';

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

export const hardcodedCourseIds = [
  {
    id: 'a56859d3-efac-43d9-9ad1-20ca9d5c16ec',
    title: 'ante cunabula verecundia',
  },
  { id: '7c199af6-6f43-4147-ae02-fb9f03795322', title: 'unde ager vivo' },
  { id: 'eae72f3b-c9db-45ac-83c1-94fd6759dff6', title: 'conturbo vinco canto' },
  {
    id: '7aa791a6-a945-4712-806f-452f3806ee89',
    title: 'verto viriliter cubitum',
  },
  {
    id: '812bf54e-3e65-48db-b65d-a5ebc808d232',
    title: 'claustrum laudantium dens',
  },
  { id: 'b1067ef8-5b18-4690-af06-b498278ade8d', title: 'vesica causa coma' },
  { id: '686f62e4-70f8-4d51-bf10-8979fabb386b', title: 'New Title' },
  {
    id: 'dfaf1e0e-a7cd-4ebb-9674-6da2360b6d29',
    title: 'Trying to create a new Course',
  },
  { id: '40f80ee7-76c7-41c2-b2d4-940fc9a140a3', title: 'This is a new Course' },
  { id: '139d3425-457b-4c67-ba7c-2938565c40e9', title: 'Python' },
  {
    id: '9af9652e-da3f-43cf-af82-5fb8c40dd51f',
    title: 'This is another Python course',
  },
  { id: '4f60a103-888a-4061-b6d3-42afa46ff077', title: 'New Title' },
  { id: '7498b929-b875-416a-8a44-e6b9eedc69b1', title: 'Master NextJS' },
  { id: 'b21f7ec1-f128-46bb-9a0d-9960de478997', title: 'ImageUrl Course' },
  { id: '79a3663a-df9f-44b8-9402-2c8b364f6d74', title: 'Golang' },
  { id: '7ebdd20a-b7e1-478c-a2eb-b033cbce7f8d', title: 'NodeJS' },
  { id: 'fbdda0f3-46c4-4ea8-b287-1d0acc803a89', title: 'Microservies' },
  { id: 'a65f6e86-ef75-4f4d-99d9-86fdd884e016', title: 'Payment Course' },
  {
    id: '91157797-8eaa-4049-a676-3e218f935a3c',
    title: 'vinculum theca cohibeo',
  },
  {
    id: '0772d17a-6b40-4683-8766-49055c35969e',
    title: 'vereor argumentum cognatus',
  },
  { id: 'dbe9baeb-a46b-4a72-83bc-7056bef38e18', title: 'vivo derideo tepesco' },
  { id: '7b2f0c20-f020-424a-b94e-55970dda0fb2', title: 'cogito copiose arma' },
  {
    id: '46ed8399-4591-48cb-8f9f-752c1373d8f4',
    title: 'synagoga demum aestus',
  },
  {
    id: '5b9cc528-c12b-4018-be12-b7a4cfc70736',
    title: 'defendo clementia cinis',
  },
  {
    id: 'bf69f76f-0dc8-4a84-a163-77dd7a30671b',
    title: 'thymbra auctus adeptio',
  },
  { id: '5352b67c-8960-49ff-9e8e-50a2d12136d7', title: 'conicio conor sum' },
  {
    id: 'ca5f6d23-51d4-4ecb-b705-79ac500d908c',
    title: 'umquam trans attonbitus',
  },
  { id: '29f80118-1f6c-43f3-9813-0e5a3d0edf08', title: 'tenetur anser cur' },
  { id: 'a1196361-d208-4be7-9c77-06ddb9251dc4', title: 'carcer cernuus arca' },
  {
    id: 'bb6ce1df-e3a4-41b1-ac98-af82772f428c',
    title: 'conor officia territo',
  },
  {
    id: 'fa08b369-f178-42b7-8973-694d66f4fb76',
    title: 'accusator utroque quidem',
  },
  {
    id: '7285ac3e-85dd-429f-9e94-aab84d83b0c8',
    title: 'timidus adstringo tristis',
  },
  {
    id: '0ba92f6d-1f65-4387-81a1-1f1ac99615c6',
    title: 'tamisium acer subseco',
  },
];

async function main() {
  const courseData = hardcodedCourseIds.map((c) => ({
    id: c.id,
    instructorId: faker.helpers.arrayElement(hardcodedInstructorIds),
    status: faker.helpers.arrayElement(['draft', 'published']),
    prerequisiteCourseId: faker.datatype.boolean()
      ? faker.helpers.arrayElement(hardcodedCourseIds).id
      : null,
    price: faker.finance.amount({ min: 100, max: 100000, dec: 2 }),
    currency: 'INR',
  }));

  await db.insert(courses).values(courseData).onConflictDoNothing();

  const enrollmentData = Array.from({ length: 100 }).map(() => {
    const course = faker.helpers.arrayElement(hardcodedCourseIds);
    return {
      status: faker.helpers.arrayElement(['active', 'suspended', 'completed']),
      userId: faker.string.uuid(),
      courseId: course.id,
      coursePriceAtEnrollment: faker.finance.amount({
        min: 100,
        max: 100000,
        dec: 2,
      }),
      courseStructure: {
        totalLessons: faker.number.int({ min: 5, max: 50 }),
        modules: Array.from({
          length: faker.number.int({ min: 1, max: 5 }),
        }).map(() => ({
          id: faker.string.uuid(),
          lessonIds: Array.from({
            length: faker.number.int({ min: 1, max: 10 }),
          }).map(() => faker.string.uuid()),
        })),
      },
      progress: {
        completedLessons: [],
      },
      progressPercentage: '0.0',
      enrolledAt: faker.date.past(),
      lastAccessedAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
  });

  await db.insert(enrollments).values(enrollmentData).onConflictDoNothing();

  console.log('Seed complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
