function sealed(target:Function):void{
    Object.seal(target)
    Object.seal(target.prototype)
}


// Method decorator: logs the method name, arguments, and return value.

function log(_target: object, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
        console.log(`Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`);

        const result: unknown = originalMethod.apply(this, args);

        console.log(`${propertyKey} returned: ${JSON.stringify(result)}`);

        return result;
    };
}


@sealed
class User {
    constructor(private name: string) {}

    @log
    greet(greeting: string): string {
        return `${greeting}, ${this.name}!`;
    }
}


// Demo / verification

const user = new User("Alice");

console.log(user.greet("Hello"));

console.log("Is User (constructor) sealed:", Object.isSealed(User));
console.log("Is User.prototype sealed:", Object.isSealed(User.prototype));

// Sealed objects reject new properties (silently in non-strict mode, no-op here since
// compiled output runs in strict mode, so this assignment throws instead).
try {
    (User.prototype as unknown as Record<string, unknown>)["extra"] = "should not be added";
    console.log("Added new property to sealed prototype (unexpected).");
} catch (error) {
    console.log("Adding a new property to the sealed prototype failed as expected:", (error as Error).message);
}
