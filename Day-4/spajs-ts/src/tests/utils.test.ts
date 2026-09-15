import { generateId } from "@utils";

describe("generateId", () => {
  it("uses crypto.randomUUID when it's available", () => {
    const id = generateId();
    // jsdom's test environment provides crypto.randomUUID, so we should
    // get a real UUID back (format: 8-4-4-4-12 hex characters).
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("falls back to a timestamp-based id when crypto.randomUUID is missing", () => {
    const originalRandomUUID = crypto.randomUUID;
    // `randomUUID` isn't a plain writable property, so plain `delete` or
    // reassignment doesn't remove it — redefine it with defineProperty
    // instead, and make sure it's configurable so we can put it back.
    Object.defineProperty(crypto, "randomUUID", {
      value: undefined,
      configurable: true
    });

    try {
      const id = generateId();
      expect(id).toMatch(/^id-\d+-[0-9a-f]+$/);
    } finally {
      Object.defineProperty(crypto, "randomUUID", {
        value: originalRandomUUID,
        configurable: true
      });
    }
  });
});
