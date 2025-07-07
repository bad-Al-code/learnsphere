import { describe, it, expect } from "vitest";
import axios from "axios";

import { env } from "../../src/config/env";

const API_URL = `http://localhost:${env.PORT}/api/auth`;

describe("E2E - Health Check", () => {
  describe("/health endpoint", { concurrent: false }, () => {
    it("should return a 200 OK and an UP status", async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);

        expect(response.status).toBe(200);
        expect(response.data).toEqual({
          status: "UP",
          message: "Auth service is up and running",
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
          throw new Error(
            `E2E test failed: Connection refused. Is the server running on port ${env.PORT}?`
          );
        }

        throw error;
      }
    });
  });
});
