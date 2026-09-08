"use strict";
//user interface
const user1 = {
    id: 1,
    name: "Sona",
    email: "sonakajalsd10@hmail.com",
    role: "admin",
    createdAt: "13-10-2003",
    status: "active",
    // motherTounge: "tamil"  //excess error check
};
const user2 = user1;
const user3 = user1;
user3.name = "Jananai";
const updatedUser = {
    ...user1,
    ...user3
};
