"use strict";
// 1. Observable<T>, Observer<T> and Unsubscribe
// 2. Subject<T> implements Observable<T>
class Subject {
    observers = [];
    subscribe(observer) {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter((item) => item !== observer);
        };
    }
    notify(value) {
        for (const observer of this.observers) {
            observer.update(value);
        }
    }
}
// 4. CommandHistory with undo / redo
class CommandHistory {
    undoStack = [];
    redoStack = [];
    execute(command) {
        command.execute();
        this.undoStack.push(command);
        // A new command clears the redo history
        this.redoStack = [];
    }
    undo() {
        const command = this.undoStack.pop();
        if (command === undefined) {
            return;
        }
        command.undo();
        this.redoStack.push(command);
    }
    redo() {
        const command = this.redoStack.pop();
        if (command === undefined) {
            return;
        }
        command.execute();
        this.undoStack.push(command);
    }
}
// Example Command
class AddNumberCommand {
    values;
    value;
    constructor(values, value) {
        this.values = values;
        this.value = value;
    }
    execute() {
        this.values.push(this.value);
    }
    undo() {
        this.values.pop();
    }
}
// 5. Typed test with five commands
const values = [];
const commandHistory = new CommandHistory();
const command1 = new AddNumberCommand(values, 1);
const command2 = new AddNumberCommand(values, 2);
const command3 = new AddNumberCommand(values, 3);
const command4 = new AddNumberCommand(values, 4);
const command5 = new AddNumberCommand(values, 5);
// Execute five commands
commandHistory.execute(command1);
commandHistory.execute(command2);
commandHistory.execute(command3);
commandHistory.execute(command4);
commandHistory.execute(command5);
console.log("After five commands:", values);
// [1, 2, 3, 4, 5]
// Undo five commands
commandHistory.undo();
commandHistory.undo();
commandHistory.undo();
commandHistory.undo();
commandHistory.undo();
console.log("After five undos:", values);
// []
// Redo five commands
commandHistory.redo();
commandHistory.redo();
commandHistory.redo();
commandHistory.redo();
commandHistory.redo();
console.log("After five redos:", values);
// [1, 2, 3, 4, 5]
const afterExecute = [1, 2, 3, 4, 5];
if (JSON.stringify(values) !== JSON.stringify(afterExecute)) {
    throw new Error("Redo test failed");
}
console.log("All CommandHistory tests passed!");
