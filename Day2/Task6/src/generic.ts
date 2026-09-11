// ===============================
// 1. Types
// ===============================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestConfig = {
    method: HttpMethod;
    url: string;
    body?: unknown;
};

type RequestInterceptor = (
    config: RequestConfig
) => RequestConfig;

type ResponseInterceptor<T> = (
    response: T
) => T;


// ===============================
// 2. API Client Interface
// ===============================

interface ApiClientInterface {
    get<T>(path: string): Promise<T>;

    post<T, B>(
        path: string,
        body: B
    ): Promise<T>;

    put<T, B>(
        path: string,
        body: B
    ): Promise<T>;

    delete<T>(path: string): Promise<T>;
}


// ===============================
// 3. Generic fetchJSON
// ===============================

async function fetchJSON<T>(
    config: RequestConfig
): Promise<T> {

    const response = await fetch(config.url, {
        method: config.method,
        headers: {
            "Content-Type": "application/json"
        },
        body: config.body
            ? JSON.stringify(config.body)
            : undefined
    });

    if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
    }

    const data = await response.json();

    return data as T;
}


// ===============================
// 4. ApiClient
// ===============================

class ApiClient implements ApiClientInterface {

    private baseUrl: string;

    private requestInterceptors:
        RequestInterceptor[] = [];

    private responseInterceptors:
        Array<ResponseInterceptor<any>> = [];


    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }


    // ---------------------------
    // Request interceptor
    // ---------------------------

    addRequestInterceptor(
        interceptor: RequestInterceptor
    ): void {

        this.requestInterceptors.push(interceptor);
    }


    // ---------------------------
    // Response interceptor
    // ---------------------------

    addResponseInterceptor<T>(
        interceptor: ResponseInterceptor<T>
    ): void {

        this.responseInterceptors.push(
            interceptor as ResponseInterceptor<any>
        );
    }


    // ---------------------------
    // Internal request
    // ---------------------------

    private async request<T>(
        config: RequestConfig
    ): Promise<T> {

        let finalConfig = config;

        // Request interceptors
        for (const interceptor of this.requestInterceptors) {
            finalConfig = interceptor(finalConfig);
        }

        // Fetch
        let data = await fetchJSON<T>(finalConfig);

        // Response interceptors
        for (const interceptor of this.responseInterceptors) {
            data = interceptor(data);
        }

        return data;
    }


    // ===========================
    // GET
    // ===========================

    async get<T>(
        path: string
    ): Promise<T> {

        return this.request<T>({
            method: "GET",
            url: `${this.baseUrl}${path}`
        });
    }


    // ===========================
    // POST
    // ===========================

    async post<T, B>(
        path: string,
        body: B
    ): Promise<T> {

        return this.request<T>({
            method: "POST",
            url: `${this.baseUrl}${path}`,
            body
        });
    }


    // ===========================
    // PUT
    // ===========================

    async put<T, B>(
        path: string,
        body: B
    ): Promise<T> {

        return this.request<T>({
            method: "PUT",
            url: `${this.baseUrl}${path}`,
            body
        });
    }


    // ===========================
    // DELETE
    // ===========================

    async delete<T>(
        path: string
    ): Promise<T> {

        return this.request<T>({
            method: "DELETE",
            url: `${this.baseUrl}${path}`
        });
    }
}


// =======================================
// 5. Example API Types
// =======================================

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUser {
    name: string;
    email: string;
}

interface UpdateUser {
    name?: string;
    email?: string;
}


// =======================================
// 6. Create API Client
// =======================================

const api = new ApiClient(
    "https://api.example.com"
);


// =======================================
// 7. Request Interceptor
// =======================================

api.addRequestInterceptor((config) => {

    console.log(
        "Request:",
        config.method,
        config.url
    );

    return {
        ...config,
        url: config.url
    };
});


// =======================================
// 8. Response Interceptor
// =======================================

api.addResponseInterceptor<User>((user) => {

    console.log("User response:", user);

    return user;
});


// =======================================
// 9. GET
// =======================================

async function getUser() {

    const user = await api.get<User>(
        "/users/1"
    );

    console.log(user.name);
    console.log(user.email);
}


// =======================================
// 10. POST
// =======================================

async function createUser() {

    const body: CreateUser = {
        name: "Sona",
        email: "sona@gmail.com"
    };

    const user = await api.post<User, CreateUser>(
        "/users",
        body
    );

    console.log(user.id);
    console.log(user.name);
}


// =======================================
// 11. PUT
// =======================================

async function updateUser() {

    const body: UpdateUser = {
        name: "Kajal"
    };

    const user = await api.put<User, UpdateUser>(
        "/users/1",
        body
    );

    console.log(user);
}


// =======================================
// 12. DELETE
// =======================================

async function deleteUser() {

    const result = await api.delete<{ success: boolean }>(
        "/users/1"
    );

    console.log(result.success);
}


// =======================================
// 13. Mock API Client
// =======================================

class MockApiClient implements ApiClientInterface {

    private users: User[] = [
        {
            id: 1,
            name: "Sona",
            email: "sona@gmail.com"
        },
        {
            id: 2,
            name: "Rahul",
            email: "rahul@gmail.com"
        }
    ];


    async get<T>(
        path: string
    ): Promise<T> {

        console.log("Mock GET:", path);

        if (path === "/users") {
            return this.users as T;
        }

        if (path.startsWith("/users/")) {

            const id = Number(
                path.split("/")[2]
            );

            const user = this.users.find(
                user => user.id === id
            );

            return user as T;
        }

        throw new Error("Mock route not found");
    }


    async post<T, B>(
        path: string,
        body: B
    ): Promise<T> {

        console.log(
            "Mock POST:",
            path,
            body
        );

        const newUser = {
            id: this.users.length + 1,
            ...(body as object)
        } as User;

        this.users.push(newUser);

        return newUser as T;
    }


    async put<T, B>(
        path: string,
        body: B
    ): Promise<T> {

        console.log(
            "Mock PUT:",
            path,
            body
        );

        const id = Number(
            path.split("/")[2]
        );

        const index = this.users.findIndex(
            user => user.id === id
        );

        if (index === -1) {
            throw new Error("User not found");
        }

        this.users[index] = {
            ...this.users[index],
            ...(body as object)
        };

        return this.users[index] as T;
    }


    async delete<T>(
        path: string
    ): Promise<T> {

        console.log(
            "Mock DELETE:",
            path
        );

        const id = Number(
            path.split("/")[2]
        );

        this.users = this.users.filter(
            user => user.id !== id
        );

        return {
            success: true
        } as T;
    }
}


// =======================================
// 14. Testing with MockApiClient
// =======================================

async function testMockApi() {

    const mockApi = new MockApiClient();

    const users = await mockApi.get<User[]>(
        "/users"
    );

    console.log("Users:", users);


    const newUser = await mockApi.post<
        User,
        CreateUser
    >(
        "/users",
        {
            name: "Anu",
            email: "anu@gmail.com"
        }
    );

    console.log("Created:", newUser);


    const updatedUser = await mockApi.put<
        User,
        UpdateUser
    >(
        "/users/1",
        {
            name: "Updated Sona"
        }
    );

    console.log("Updated:", updatedUser);


    const deleted = await mockApi.delete<
        { success: boolean }
    >(
        "/users/2"
    );

    console.log("Deleted:", deleted);
}

testMockApi();