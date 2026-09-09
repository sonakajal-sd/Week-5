// function debounce(fn:()=> void, delay:number){
//     let timer:ReturnType <typeof setTimeout>;

//     return function(){
//         clearTimeout(timer);

//         timer=setTimeout(()=>{
//             fn();
            
//         }, delay);
//     }
// }

// type Dog={
//     bark:()=> void;
// };
// type Cat={
//     meow:()=> void;
// }

// function makeSound(animal:Dog|Cat){
//     if("bark" in animal){
//         animal.bark();
//     }
//     else{
//         animal.meow();
//     }
// }


// // instanceof 

// class dog{
//     bark(){
//         console.log("whoff");
//     }
// }

// class cat{
//     meow(){
//         console.log("meow");
//     }
// }

// function sound(animal:dog|cat){
//     if(animal instanceof dog){
//         animal.bark();
//     }
//     else{
//         animal.meow();
//     }
// }

// type success={
//     status:"success";
//     data:string;
// }
// type Error

//interface &types








