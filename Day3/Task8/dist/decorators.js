"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function sealed(target) {
    Object.seal(target);
    Object.seal(target.prototype);
}
// Method decorator: logs the method name, arguments, and return value.
function log(_target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`);
        const result = originalMethod.apply(this, args);
        console.log(`${propertyKey} returned: ${JSON.stringify(result)}`);
        return result;
    };
}
let User = class User {
    name;
    constructor(name) {
        this.name = name;
    }
    greet(greeting) {
        return `${greeting}, ${this.name}!`;
    }
};
__decorate([
    log
], User.prototype, "greet", null);
User = __decorate([
    sealed
], User);
// Demo / verification
const user = new User("Alice");
console.log(user.greet("Hello"));
console.log("Is User (constructor) sealed:", Object.isSealed(User));
console.log("Is User.prototype sealed:", Object.isSealed(User.prototype));
// Sealed objects reject new properties (silently in non-strict mode, no-op here since
// compiled output runs in strict mode, so this assignment throws instead).
try {
    User.prototype["extra"] = "should not be added";
    console.log("Added new property to sealed prototype (unexpected).");
}
catch (error) {
    console.log("Adding a new property to the sealed prototype failed as expected:", error.message);
}
