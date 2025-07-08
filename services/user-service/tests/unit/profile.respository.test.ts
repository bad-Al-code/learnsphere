import { describe, it, expect, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";

import { db } from "../../src/db";
import { ProfileRepository } from "../../src/db/profile.repository";
import { profiles } from "../../src/db/schema";

beforeEach(async () => {
  await db.delete(profiles);
});

describe("ProfileRepository", () => {
  it("should create a new profile and find it by ID", async () => {
    const newProfileData = { userId: faker.string.uuid() };
    const createdProfile = await ProfileRepository.create(newProfileData);

    expect(createdProfile).toBeDefined();
    expect(createdProfile.userId).toBe(newProfileData.userId);

    const foundProfile = await ProfileRepository.findPrivateById(
      newProfileData.userId
    );
    expect(foundProfile?.userId).toBe(newProfileData.userId);
  });
});
