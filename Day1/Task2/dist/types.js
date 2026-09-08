"use strict";
let username = "Sona";
let age = 22;
let isActive = true;
let emptyValue = null;
let notDefined = undefined;
let id = Symbol("id");
let bigNumber = 11233456788888n;
let data = "hello";
let value = "typeScript";
function throwError() {
    throw new Error("Something went wrong");
}
function greet() {
    console.log("Hello");
}
let user = {
    name: "sona",
    age: 21
};
let numbers = [10, 20, 30];
let names = ["sona", "alex", "John"];
let mixed = ["sona", 21];
let person = ["Sona", 21];
let scores = [90, 85, 95];
let result = undefined;
let productName = "Lapotop";
function add(a, b) {
    return a + b;
}
console.log(add(10, 20));
function greeet(name) {
    return `Hello ${name}`;
}
console.log(greeet("Sona"));
function isEven(value) {
    return value % 2 === 0;
}
console.log(isEven(8));
function square(number) {
    return number * number;
}
console.log(square(2));
function multiply(a, b) {
    return a * b;
}
console.log(multiply(2, 2));
const greeting = "Hello";
let message = "Hello";
console.log(typeof greeting);
console.log(typeof message);
function introduce(name) {
    if (typeof name === "string") {
        console.log(`String is ${name}`);
    }
    else {
        console.log(name);
    }
}
