"use strict";
const details = {
    name: "Sona",
    age: 31
};
console.log(details);
// 2. Actual sum() method implementation
Array.prototype.sum = function () {
    return this.reduce((total, value) => total + Number(value), 0);
};
// 3. Test
const numbers = [10, 20, 30, 40];
console.log(numbers.sum());
