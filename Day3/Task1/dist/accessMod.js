"use strict";
class BankAccount {
    balance;
    accountNumber;
    owner;
    constructor(balance, accountNumber, owner) {
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.owner = owner;
    }
}
//2
class BankAccount2 {
    balance;
    owner;
    constructor(balance, owner) {
        this.balance = balance;
        this.owner = owner;
    }
}
//3
class BankAccount3 {
    transfer(amount) {
        console.log(`Transferred ${amount}`);
    }
}
class SavingsAccount extends BankAccount {
    makeTransfer(amount) {
        this.makeTransfer(amount);
    }
}
//4
class BankAccount5 {
    balance;
    #hashPrivate;
    constructor(balance, hash) {
        this.balance = balance;
        this.#hashPrivate = hash;
    }
}
