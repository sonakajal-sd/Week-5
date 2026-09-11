//
// 1. IsArray
//

type IsArray<T> =
    T extends any[] ? true : false;

type Test1 = IsArray<string[]>;
// true

type Test2 = IsArray<number>;
// false


//
// 2. Flatten
//

type Flatten<T> =
    T extends Array<infer Item>
        ? Item
        : T;

type Test3 = Flatten<string[]>;
// string

type Test4 = Flatten<number[]>;
// number

type Test5 = Flatten<string>;
// string


//
// 3. Recursive Awaited
//

type MyAwaited<T> =
    T extends Promise<infer U>
        ? MyAwaited<U>
        : T;

type Test6 = MyAwaited<Promise<string>>;
// string

type Test7 =
    MyAwaited<Promise<Promise<number>>>;
// number

type Test8 =
    MyAwaited<
        Promise<
            Promise<
                Promise<boolean>
            >
        >
    >;
// boolean


//
// 4. Parameters
//

type MyParameters<T> =
    T extends (...args: infer P) => any
        ? P
        : never;

function createUser(
    name: string,
    age: number
) {
    return {
        name,
        age
    };
}

type UserParams =
    MyParameters<typeof createUser>;

// [string, number]


//
// 5. ReturnType
//

type MyReturnType<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never;

function getUser() {
    return {
        id: 1,
        name: "Sona"
    };
}

type User =
    MyReturnType<typeof getUser>;

// {
//     id: number;
//     name: string;
// }