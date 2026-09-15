class BankAccount{
    private balance:number;
    readonly accountNumber:number;
    public owner:string;

    constructor(
        balance:number,
        accountNumber:number,
        owner:string
    ){
        this.balance=balance;
        this.accountNumber= accountNumber;
        this.owner= owner
    }
}

//2

class BankAccount2{
    constructor(
          private balance:number,
          public readonly owner:string
    ){}
}

//3
class BankAccount3{
    protected transfer(amount:number):void{
        console.log(`Transferred ${amount}`);
    }
}
class SavingsAccount extends BankAccount{
    makeTransfer(amount:number){
        this.makeTransfer(amount);
    }
}

//4
class BankAccount5{
    private balance:number;
    #hashPrivate:string;

    constructor(balance:number, hash:string){
        this.balance= balance;
        this.#hashPrivate= hash;
    }
}