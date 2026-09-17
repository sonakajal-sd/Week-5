// A tiny wrapper around fetch. The caller says what shape of data they
// expect back with a type argument, e.g. apiClient.get<User>("/users/1"),
// and TypeScript treats the result as that type from then on.
export class ApiClient {
  constructor(private baseUrl: string) {}

  /**
   * Fetches `path` and returns the parsed JSON body typed as `T`.
   *
   * `<T>` is a generic type parameter: it isn't fixed to one type here,
   * the caller picks it per-call, e.g. `apiClient.get<User>("/users/1")`
   * returns a `Promise<User>` while `apiClient.get<TaskItem[]>("/items")`
   * returns a `Promise<TaskItem[]>` — one method body, many call-site
   * shapes. Note this is a compile-time-only guarantee: `response.json()`
   * actually returns `unknown`, so the `as T` is trusting the caller to
   * pass the type that matches what the API really sends back.
   */
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`Request to ${path} failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
