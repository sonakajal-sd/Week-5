"use strict";
// 2. handleResponse<T>
function handleResponse(response) {
    if (response.success) {
        // TypeScript knows:
        // response = { success: true; data: T }
        console.log("Success!");
        console.log("Data:", response.data);
    }
    else {
        // TypeScript knows:
        // response = { success: false; error: string; statusCode: number }
        console.log("Error:", response.error);
        console.log("Status Code:", response.statusCode);
    }
}
// Example success response
const successResponse = {
    success: true,
    data: {
        id: "101",
        name: "Sona",
        email: "sona@gmail.com"
    }
};
// Example error response
const errorResponse = {
    success: false,
    error: "User not found",
    statusCode: 404
};
handleResponse(successResponse);
handleResponse(errorResponse);
// 4. Use LoadingState<User[]>
//    Return correct HTML string
function renderUsers(state) {
    switch (state.status) {
        case "idle":
            return `<div>Nothing started yet.</div>`;
        case "loading":
            return `<div>Loading users...</div>`;
        case "success":
            return `
                <ul>
                    ${state.data
                .map(user => `<li>${user.name}</li>`)
                .join("")}
                </ul>
            `;
        case "error":
            return `
                <div>
                    Error: ${state.error.message}
                </div>
            `;
        default:
            return "";
    }
}
// Example states
const idleState = {
    status: "idle"
};
const loadingState = {
    status: "loading"
};
const successState = {
    status: "success",
    data: [
        {
            id: "101",
            name: "Sona",
            email: "sona@gmail.com"
        },
        {
            id: "102",
            name: "Rahul",
            email: "rahul@gmail.com"
        }
    ]
};
const errorState = {
    status: "error",
    error: new Error("Failed to fetch users")
};
// HTML output
console.log(renderUsers(idleState));
console.log(renderUsers(loadingState));
console.log(renderUsers(successState));
console.log(renderUsers(errorState));
