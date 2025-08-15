// import { faker } from '@faker-js/faker';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Client } from 'pg';
// import { profiles } from './schema';

// const client = new Client({
//   host: 'localhost',
//   port: 5433,
//   user: 'postgres',
//   password: 'postgres',
//   database: 'user_db',
// });

// const db = drizzle(client);

// function getRandomEnumValue<T extends string>(values: T[]): T {
//   return values[Math.floor(Math.random() * values.length)];
// }

// type Status =
//   | 'active'
//   | 'instructor'
//   | 'pending_instructor_review'
//   | 'suspended';

// async function main() {
//   await client.connect();

//   const statuses: Status[] = [
//     'active',
//     'instructor',
//     'pending_instructor_review',
//     'suspended',
//   ];

//   const data = Array.from({ length: 300 }, () => {
//     const userId = faker.string.uuid();
//     const dateOfBirth = faker.date
//       .birthdate({ min: 18, max: 65, mode: 'age' })
//       .toISOString()
//       .split('T')[0];

//     return {
//       userId,
//       email: faker.internet.email(),
//       firstName: faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       bio: faker.lorem.paragraph(),
//       avatarUrls: {
//         small: faker.image.avatar(),
//         medium: faker.image.avatar(),
//         large: faker.image.avatar(),
//       },
//       headline: faker.person.jobTitle(),
//       websiteUrl: faker.internet.url(),
//       socialLinks: {
//         twitter: faker.internet.url(),
//         linkedin: faker.internet.url(),
//         github: faker.internet.url(),
//       },
//       instructorApplicationData: {
//         expertise: faker.person.jobArea(),
//         experience: faker.lorem.sentences(2),
//         motivation: faker.lorem.sentences(1),
//         submittedAt: faker.date.past().toISOString(),
//       },
//       fcmTokens: [faker.string.uuid()],
//       status: getRandomEnumValue(statuses),
//       dateOfBirth: dateOfBirth,
//       lastKnownDevice: faker.helpers.arrayElement([
//         'desktop',
//         'mobile',
//         'tablet',
//       ]),
//       settings: {
//         theme: faker.helpers.arrayElement(['light', 'dark']),
//         language: faker.helpers.arrayElement(['en', 'es', 'fr']),
//         notifications: {
//           newCourseAlerts: faker.datatype.boolean(),
//           weeklyNewsletter: faker.datatype.boolean(),
//         },
//       },
//       createdAt: faker.date.past(),
//       updatedAt: new Date(),
//     };
//   });

//   await db.insert(profiles).values(data);

//   console.log('Seeded 50 profiles');
//   await client.end();
// }

// main().catch((err) => {
//   console.error('Seeding failed:', err);
//   client.end();
// });

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

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { profiles } from './schema';

const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'postgres',
  database: 'user_db',
});

const db = drizzle(client);

async function main() {
  await client.connect();

  for (const id of hardcodedInstructorIds) {
    const dob = faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString()
      .split('T')[0];

    await db
      .update(profiles)
      .set({ dateOfBirth: dob })
      .where(eq(profiles.userId, id));
  }

  console.log(`Updated DOB for ${hardcodedInstructorIds.length} instructors`);

  await client.end();
}

main().catch((err) => {
  console.error('DOB update failed:', err);
  client.end();
});
