
// 1. Observable<T>, Observer<T> and Unsubscribe

type Unsubscribe = () => void;

interface Observer<T> {
    update(value: T): void;
}

interface Observable<T> {
    subscribe(observer: Observer<T>): Unsubscribe;
}


// 2. Subject<T> implements Observable<T>

class Subject<T> implements Observable<T> {
    private observers: Observer<T>[] = [];

    public subscribe(observer: Observer<T>): Unsubscribe {
        this.observers.push(observer);

        return (): void => {
            this.observers = this.observers.filter(
                (item: Observer<T>): boolean => item !== observer
            );
        };
    }

    public notify(value: T): void {
        for (const observer of this.observers) {
            observer.update(value);
        }
    }
}


// 3. Command interface

interface Command {
    execute(): void;
    undo(): void;
}


// 4. CommandHistory with undo / redo

class CommandHistory {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    public execute(command: Command): void {
        command.execute();

        this.undoStack.push(command);

        // A new command clears the redo history
        this.redoStack = [];
    }

    public undo(): void {
        const command: Command | undefined = this.undoStack.pop();

        if (command === undefined) {
            return;
        }

        command.undo();
        this.redoStack.push(command);
    }

    public redo(): void {
        const command: Command | undefined = this.redoStack.pop();

        if (command === undefined) {
            return;
        }

        command.execute();
        this.undoStack.push(command);
    }
}


// Example Command

class AddNumberCommand implements Command {
    private readonly values: number[];
    private readonly value: number;

    constructor(values: number[], value: number) {
        this.values = values;
        this.value = value;
    }

    public execute(): void {
        this.values.push(this.value);
    }

    public undo(): void {
        this.values.pop();
    }
}


// 5. Typed test with five commands

const values: number[] = [];

const commandHistory: CommandHistory = new CommandHistory();

const command1: Command = new AddNumberCommand(values, 1);
const command2: Command = new AddNumberCommand(values, 2);
const command3: Command = new AddNumberCommand(values, 3);
const command4: Command = new AddNumberCommand(values, 4);
const command5: Command = new AddNumberCommand(values, 5);


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



const afterExecute: number[] = [1, 2, 3, 4, 5];

if (JSON.stringify(values) !== JSON.stringify(afterExecute)) {
    throw new Error("Redo test failed");
}

console.log("All CommandHistory tests passed!");

