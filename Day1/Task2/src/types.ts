let username:string ="Sona";

let age:number= 22;

let isActive:boolean= true;

let emptyValue:null =null;

let notDefined:undefined = undefined;

let id:symbol = Symbol("id");

let bigNumber:bigint= 11233456788888n;

let data:any ="hello";

let value:unknown ="typeScript";

function throwError():never{
    throw new Error("Something went wrong");
}




function greet():void{
    console.log("Hello");
}

let user:object={
    name:"sona",
    age:21
};

let numbers:number[] =[10,20,30];
let names: string[]=["sona", "alex","John"];

let mixed: (string| number)[]=["sona",21];

let person:[string, number] =["Sona", 21];
let scores: readonly number[]= [90,85,95];
let result: string|undefined = undefined;

let productName: string="Lapotop";


function add(a:number, b:number):number{
    return a+b;
}
console.log(add(10,20));


function greeet(name:string):string{
    return `Hello ${name}`;
}
console.log(greeet("Sona"));

function isEven(value:number):boolean{
   return value%2 ===0;
}

console.log(isEven(8));



function square(number:number):number{
    return  number*number;
}

console.log(square(2));


function multiply(a:number,b:number){
    return a*b;
}
console.log(multiply(2,2));


const greeting="Hello"

let message="Hello"
console.log(typeof greeting);
console.log(typeof message);



function introduce(name:string|number):void{
    if(typeof name ==="string"){
        console.log(`String is ${name}`);
    }
    else{
        console.log(name)
    }
}
