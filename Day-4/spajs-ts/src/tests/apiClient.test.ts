import { ApiClient } from "../apiClient.js";

interface User {
  id: number;
  name: string;
}

describe("ApiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns data typed as whatever generic argument was passed in", async () => {
    const fakeUser: User = { id: 1, name: "Ada" };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeUser)
    }) as unknown as typeof fetch;

    const client = new ApiClient("https://example.test");
    const user = await client.get<User>("/users/1");

    // TypeScript already treats `user` as a User here, not `any` — try
    // renaming `user.name` to `user.naem` and tsc will fail before the
    // test even runs.
    expect(user.name).toBe("Ada");
    expect(user.id).toBe(1);
  });

  it("throws a clear error when the response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({})
    }) as unknown as typeof fetch;

    const client = new ApiClient("https://example.test");

    await expect(client.get<User>("/users/999")).rejects.toThrow("404");
  });
});
