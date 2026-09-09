// strictNullChecks = "null/undefined-a ignore pannadha!" 🔍 
// noImplicitAny → type missing-na TypeScript warning/error kudukkum. 
// strictFunctionTypes → function parameters compatible-ah irukka nu strict-ah check pannum. 
// strictPropertyInitialization → class property-ku value initialize pannirukkiya nu check pannum.


// Correct:
// try {
//     // code
// } catch (error) {
//     if (error instanceof Error) {
//         console.log(error.message);
//     }
// }
// useUnknownInCatchVariables → catch error-a automatically any nu assume pannama unknown ah treat pannum. 

// noImplicitThis → this-ku type/context clear-ah irukka nu TypeScript check pannum. 
// noUncheckedIndexedAccess → array/object index-la value irukkum nu blindly trust panna koodadhu.


// function nullChecks(name:string):string{
   
//  return null;
// }
// console.log(nullChecks("SOna"));



// corrected versions 
function nullChecks(name:string|null):string|null{
    return null;
}



const arr:string[]=[];
const result= arr[0];

if( result !==undefined){
    console.log(result.toUpperCase());
}