// ========================================
// 1. Declaration Merging - User
// ========================================

interface User {
    name: string;
}

interface User {
    age: number;
}

const details: User = {
    name: "Sona",
    age: 31
};

console.log(details);


// ========================================
// 2. Declaration Merging - Array
// ========================================

interface Array<T> {
    sum(): number;
}

Array.prototype.sum = function (): number {
    return this.reduce((total, value) => total + Number(value), 0);
};

const numbers = [10, 20, 30, 40];

console.log(numbers.sum());


// ========================================
// 3. Declaration Merging - Window
// ========================================

interface Window {
    appState: {
        user: string;
        isLoggedIn: boolean;
    };
}

window.appState = {
    user: "Sona",
    isLoggedIn: true
};

console.log(window.appState);








import { Calculator } from "./library";
const calc= new Calculator();
console.log(calc.add(10,5));