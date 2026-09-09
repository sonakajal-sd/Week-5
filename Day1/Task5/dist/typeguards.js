"use strict";
// Write processInput(value: string | number | boolean | null | undefined) using typeof, equality, and nullish narrowing
// Write custom type guard isUser(value: unknown): value is User that validates an unknown API response
// Use discriminated unions: Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; w: number; h: number }. Write getArea using exhaustive switch.
// Show the never type: add a new Shape variant, TypeScript catches the missing case
function processInput(value) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    if (typeof value !== null) {
        console.log("happy Happy Happy");
    }
    else {
        console.log(value);
    }
}
function isUser(value) {
    if (typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value &&
        "age" in value &&
        "email" in value &&
        typeof value.id === "number" &&
        typeof value.name === "string" &&
        typeof value.age === "number" &&
        typeof value.email === "string") {
        return true;
    }
    return false;
}
function getArea(shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rect":
            return shape.w * shape.h;
        default:
            const _exhaustive = shape;
            return _exhaustive;
    }
}
