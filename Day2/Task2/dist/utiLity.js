"use strict";
// 1. Partial<User>
async function updateUser(id, changes) {
    console.log("Updating user:", id);
    console.log("Changes:", changes);
    // Example updated user
    const updatedUser = {
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
function createRequiredUser(data) {
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
// Example
function getUserPreview() {
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
// Example
function createUser(data) {
    return {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date()
    };
}
const userInput = {
    name: "Anu",
    email: "anu@gmail.com",
    age: 23,
    avatar: "anu.jpg"
};
const createdUser = createUser(userInput);
console.log(createdUser);
const config = {
    apiUrl: "https://api.example.com",
    apiKey: "abc123",
    environment: "production",
    timeout: "5000"
};
console.log(config);
