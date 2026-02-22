import database from "../../../../../infra/database.js";

const cleanDatabase = async () => {
  await database.query("drop schema public cascade; create schema public;");
};

describe("POST to /api/v1/migrations", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  test("POST to /api/v1/migrations should return 201", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);
  });

  test("should run migrations from infra/migrations directory", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody[0]).toEqual(
      expect.objectContaining({
        path: expect.stringMatching(/^infra\/migrations\/.+\.js$/),
      }),
    );
  });

  test("should call the migration runner function with the correct arguments", async () => {
    const firstResponse = await fetch(
      "http://localhost:3000/api/v1/migrations?debug=true",
      {
        method: "POST",
      },
    );

    expect(firstResponse.status).toBe(201);

    const secondResponse = await fetch(
      "http://localhost:3000/api/v1/migrations?debug=true",
      {
        method: "POST",
      },
    );

    const secondResponseBody = await secondResponse.json();
    expect(secondResponse.status).toBe(200);

    expect(secondResponseBody.length === 0).toBe(true);
  });
});
