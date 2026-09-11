"use strict";
// ===============================
// 1. Types
// ===============================
// ===============================
// 3. Generic fetchJSON
// ===============================
async function fetchJSON(config) {
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
        throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
// ===============================
// 4. ApiClient
// ===============================
class ApiClient {
    baseUrl;
    requestInterceptors = [];
    responseInterceptors = [];
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    // ---------------------------
    // Request interceptor
    // ---------------------------
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    // ---------------------------
    // Response interceptor
    // ---------------------------
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    // ---------------------------
    // Internal request
    // ---------------------------
    async request(config) {
        let finalConfig = config;
        // Request interceptors
        for (const interceptor of this.requestInterceptors) {
            finalConfig = interceptor(finalConfig);
        }
        // Fetch
        let data = await fetchJSON(finalConfig);
        // Response interceptors
        for (const interceptor of this.responseInterceptors) {
            data = interceptor(data);
        }
        return data;
    }
    // ===========================
    // GET
    // ===========================
    async get(path) {
        return this.request({
            method: "GET",
            url: `${this.baseUrl}${path}`
        });
    }
    // ===========================
    // POST
    // ===========================
    async post(path, body) {
        return this.request({
            method: "POST",
            url: `${this.baseUrl}${path}`,
            body
        });
    }
    // ===========================
    // PUT
    // ===========================
    async put(path, body) {
        return this.request({
            method: "PUT",
            url: `${this.baseUrl}${path}`,
            body
        });
    }
    // ===========================
    // DELETE
    // ===========================
    async delete(path) {
        return this.request({
            method: "DELETE",
            url: `${this.baseUrl}${path}`
        });
    }
}
// =======================================
// 6. Create API Client
// =======================================
const api = new ApiClient("https://api.example.com");
// =======================================
// 7. Request Interceptor
// =======================================
api.addRequestInterceptor((config) => {
    console.log("Request:", config.method, config.url);
    return {
        ...config,
        url: config.url
    };
});
// =======================================
// 8. Response Interceptor
// =======================================
api.addResponseInterceptor((user) => {
    console.log("User response:", user);
    return user;
});
// =======================================
// 9. GET
// =======================================
async function getUser() {
    const user = await api.get("/users/1");
    console.log(user.name);
    console.log(user.email);
}
// =======================================
// 10. POST
// =======================================
async function createUser() {
    const body = {
        name: "Sona",
        email: "sona@gmail.com"
    };
    const user = await api.post("/users", body);
    console.log(user.id);
    console.log(user.name);
}
// =======================================
// 11. PUT
// =======================================
async function updateUser() {
    const body = {
        name: "Kajal"
    };
    const user = await api.put("/users/1", body);
    console.log(user);
}
// =======================================
// 12. DELETE
// =======================================
async function deleteUser() {
    const result = await api.delete("/users/1");
    console.log(result.success);
}
// =======================================
// 13. Mock API Client
// =======================================
class MockApiClient {
    users = [
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
    async get(path) {
        console.log("Mock GET:", path);
        if (path === "/users") {
            return this.users;
        }
        if (path.startsWith("/users/")) {
            const id = Number(path.split("/")[2]);
            const user = this.users.find(user => user.id === id);
            return user;
        }
        throw new Error("Mock route not found");
    }
    async post(path, body) {
        console.log("Mock POST:", path, body);
        const newUser = {
            id: this.users.length + 1,
            ...body
        };
        this.users.push(newUser);
        return newUser;
    }
    async put(path, body) {
        console.log("Mock PUT:", path, body);
        const id = Number(path.split("/")[2]);
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) {
            throw new Error("User not found");
        }
        this.users[index] = {
            ...this.users[index],
            ...body
        };
        return this.users[index];
    }
    async delete(path) {
        console.log("Mock DELETE:", path);
        const id = Number(path.split("/")[2]);
        this.users = this.users.filter(user => user.id !== id);
        return {
            success: true
        };
    }
}
// =======================================
// 14. Testing with MockApiClient
// =======================================
async function testMockApi() {
    const mockApi = new MockApiClient();
    const users = await mockApi.get("/users");
    console.log("Users:", users);
    const newUser = await mockApi.post("/users", {
        name: "Anu",
        email: "anu@gmail.com"
    });
    console.log("Created:", newUser);
    const updatedUser = await mockApi.put("/users/1", {
        name: "Updated Sona"
    });
    console.log("Updated:", updatedUser);
    const deleted = await mockApi.delete("/users/2");
    console.log("Deleted:", deleted);
}
testMockApi();
