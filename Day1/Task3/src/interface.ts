//user interface

interface User{
    id:number;
    name:string;
    email:string;
    role:"admin"|"viewer"|"editor";
    createdAt:string;
    avatar?:string;
    status:"active"|"inactive";
}

const user1:User={
    id:1,
    name:"Sona",
    email:"sonakajalsd10@hmail.com",
    role:"admin",
    createdAt:"13-10-2003",
    status:"active",
    // motherTounge: "tamil"  //excess error check
}

type ReadonlyUser=Readonly<User>;

const user2:ReadonlyUser=user1;

// user2.name="Ram";    


type UserChanges= Partial<User>
const user3:UserChanges =user1;

user3.name="Jananai";


const updatedUser={
    ...user1,
    ...user3 
}

type admin={
    name:string;
}