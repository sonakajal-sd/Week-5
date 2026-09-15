// Task 5 - TypedEventEmitter

interface User {
    id: string;
    name: string;
    age: number;
}

type UserEvents = {
    userAdded: [User];
    userRemoved: [string];
    userUpdated: [string, Partial<User>];
};

class TypedEventEmitter<Events extends Record<string, unknown[]>> {

    private listeners: {
        [K in keyof Events]?: Array<(...args: Events[K]) => void>;
    } = {};

    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event]!.push(listener);
        return this;
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K]
    ): void {
        this.listeners[event]?.forEach(listener => {
            listener(...args);
        });
    }
}


// Create emitter
const emitter = new TypedEventEmitter<UserEvents>();


// User Added
emitter.on("userAdded", (user) => {
    console.log("User added:", user.name);
});


// User Removed
emitter.on("userRemoved", (id) => {
    console.log("User removed:", id);
});


// User Updated
emitter.on("userUpdated", (id, changes) => {
    console.log("User updated:", id, changes);
});


// Emit events
const user: User = {
    id: "u101",
    name: "Sona",
    age: 31
};

emitter.emit("userAdded", user);

emitter.emit("userRemoved", "u101");

emitter.emit("userUpdated", "u101", {
    age: 32
});


// TypeScript catches these errors:

// emitter.emit("userAdded", "wrong");
// emitter.emit("userRemoved", 123);
// emitter.emit("userUpdated", "u101", 25);
// emitter.emit("unknownEvent");