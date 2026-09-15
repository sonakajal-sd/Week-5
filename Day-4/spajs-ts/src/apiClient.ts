// A tiny wrapper around fetch. The caller says what shape of data they
// expect back with a type argument, e.g. apiClient.get<User>("/users/1"),
// and TypeScript treats the result as that type from then on.
export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`Request to ${path} failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
