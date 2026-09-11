interface User {
    id: string;
    name: string;
    email: string;
}


// 1. ApiResponse<T>

type ApiResponse<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
        statusCode: number;
    };


// 2. handleResponse<T>

function handleResponse<T>(
    response: ApiResponse<T>
): void {

    if (response.success) {
        // TypeScript knows:
        // response = { success: true; data: T }

        console.log("Success!");
        console.log("Data:", response.data);

    } else {
        // TypeScript knows:
        // response = { success: false; error: string; statusCode: number }

        console.log("Error:", response.error);
        console.log("Status Code:", response.statusCode);
    }
}


// Example success response

const successResponse: ApiResponse<User> = {
    success: true,
    data: {
        id: "101",
        name: "Sona",
        email: "sona@gmail.com"
    }
};


// Example error response

const errorResponse: ApiResponse<User> = {
    success: false,
    error: "User not found",
    statusCode: 404
};

handleResponse(successResponse);
handleResponse(errorResponse);


// 3. LoadingState<T>

type LoadingState<T> =
    | {
        status: "idle";
    }
    | {
        status: "loading";
    }
    | {
        status: "success";
        data: T;
    }
    | {
        status: "error";
        error: Error;
    };


// 4. Use LoadingState<User[]>
//    Return correct HTML string

function renderUsers(
    state: LoadingState<User[]>
): string {

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

const idleState: LoadingState<User[]> = {
    status: "idle"
};

const loadingState: LoadingState<User[]> = {
    status: "loading"
};

const successState: LoadingState<User[]> = {
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

const errorState: LoadingState<User[]> = {
    status: "error",
    error: new Error("Failed to fetch users")
};


// HTML output

console.log(renderUsers(idleState));
console.log(renderUsers(loadingState));
console.log(renderUsers(successState));
console.log(renderUsers(errorState));