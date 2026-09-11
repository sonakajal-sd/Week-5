"use strict";
function identity(arg) {
    return arg;
}
const c1 = identity("Sona");
const c2 = identity(21);
const custom = identity({
    name: "Sona",
    age: 22
});
function first(arr) {
    return arr[0];
}
const s1 = first(["Ram", "Radhe", "ravana"]);
console.log(s1);
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Http error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
function getProperty(obj, key) {
    return obj[key];
}
const user1 = {
    name: "Sona",
    age: 21,
    email: "sonakajalasd10@fmail.com"
};
const name1 = getProperty(user1, "name");
const age = getProperty(user1, "age");
console.log(name1);
