function identity<T>(arg:T):T{
    return arg
}
interface User{
    name:string;
    age:number;
}
const c1= identity("Sona");
const c2=identity(21);
const custom= identity<User>({
    name:"Sona",
    age:22
})




function first<T>(arr: T[]): T|undefined{
    return arr[0];
}

const s1= first(["Ram", "Radhe", "ravana"]);
console.log(s1);





async function  fetchData<T>(url:string):Promise<T>{
    const response= await fetch(url);

    if(!response.ok){
        throw new Error(`Http error: ${response.status}`);
    }
    const data= await response.json();
    return data;
}



function getProperty<T ,K extends keyof T>(obj:T , key:K): T[K]{
    return obj[key];
}

const user1={
    name:"Sona",
    age:21,
    email:"sonakajalasd10@fmail.com"
}
const name1= getProperty(user1, "name");
const age=getProperty(user1, "age")

console.log(name1);






class Queue<T>{
    private items:T[]= [];


    enqueue(item:T):void{
        this.items.push(item);
    }

    dequeue():T|undefined{
        return this.items.shift();
    }

    peek():T|undefined{   //to tlook whts in fisrt item
        return this.items[0];
    }
    isEmpty():boolean{
        return this.items.length ===0;
    }
}

const numbers= new Queue<number>();
numbers.enqueue(10);
numbers.enqueue

