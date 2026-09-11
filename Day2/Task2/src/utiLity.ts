interface User {
    id: string;
    name: string;
    email: string;
    age: number;
    avatar: string;
    createdAt: Date;
}


// 1. Partial<User>
async function updateUser(
    id: string,
    changes: Partial<User>
): Promise<User> {

    console.log("Updating user:", id);
    console.log("Changes:", changes);

    // Example updated user
    const updatedUser: User = {
        id,
        name: changes.name ?? "Sona",
        email: changes.email ?? "sona@gmail.com",
        age: changes.age ?? 21,
        avatar: changes.avatar ?? "default.jpg",
        createdAt: new Date()
    };

    return updatedUser;
}


// Example
updateUser("101", {
    name: "Kajal",
    age: 22
}).then(user => {
    console.log(user);
});


// 2. Required<User>
function createRequiredUser(
    data: Required<User>
): User {
    return data;
}


// Example
const newUser = createRequiredUser({
    id: "102",
    name: "Rahul",
    email: "rahul@gmail.com",
    age: 25,
    avatar: "rahul.jpg",
    createdAt: new Date()
});

console.log(newUser);


// 3. Pick<User, "id" | "name" | "avatar">

type UserPreview = Pick<User, "id" | "name" | "avatar">;


// Example
function getUserPreview(): UserPreview[] {
    return [
        {
            id: "101",
            name: "Sona",
            avatar: "sona.jpg"
        },
        {
            id: "102",
            name: "Rahul",
            avatar: "rahul.jpg"
        }
    ];
}

console.log(getUserPreview());


// 4. Omit<User, "id" | "createdAt">

type UserInput = Omit<User, "id" | "createdAt">;


// Example
function createUser(data: UserInput): User {
    return {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date()
    };
}

const userInput: UserInput = {
    name: "Anu",
    email: "anu@gmail.com",
    age: 23,
    avatar: "anu.jpg"
};

const createdUser = createUser(userInput);

console.log(createdUser);


// 5. Record<ConfigKey, string>

type ConfigKey =
    | "apiUrl"
    | "apiKey"
    | "environment"
    | "timeout";

const config: Record<ConfigKey, string> = {
    apiUrl: "https://api.example.com",
    apiKey: "abc123",
    environment: "production",
    timeout: "5000"
};

console.log(config);