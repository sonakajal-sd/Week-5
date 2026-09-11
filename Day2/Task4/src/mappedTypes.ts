interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    isAdmin: boolean;
}


// 1. Basic mapped type
type UserTypes = {
    [K in keyof User]: User[K];
};


// 2. Optional properties
type OptionalUser = {
    [K in keyof User]?: User[K];
};


// 3. Readonly properties
type ReadonlyUser = {
    readonly [K in keyof User]: User[K];
};


// 4. All properties required
type RequiredUser = {
    [K in keyof User]-?: User[K];
};


// 5. Remove readonly
type MutableUser = {
    -readonly [K in keyof User]: User[K];
};


// 6. Transform every property to boolean
type UserPermissions = {
    [K in keyof User]: boolean;
};


// 7. Custom Partial
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};


// 8. Custom Readonly
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};


// 9. Using custom Partial

const partialUser: MyPartial<User> = {
    name: "Sona"
};


// 10. Using custom Readonly

const readonlyUser: MyReadonly<User> = {
    id: "101",
    name: "Sona",
    age: 21,
    email: "sona@gmail.com",
    isAdmin: false
};

// readonlyUser.name = "Kajal";
// ❌ Error