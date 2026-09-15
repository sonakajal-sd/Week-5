
type ValidationResult = {
    valid: boolean;
    errors: string[];
};


// 2. Serializable Interface
interface Serializable {
    toJSON(): string;
    fromJSON(data: string): this;
}


// 3. Printable Interface
interface Printable {
    print(): void;
    getDisplayName(): string;
}


// 4. Validatable Interface
interface Validatable {
    validate(): ValidationResult;
}


// 5. Document implements all 3 interfaces
class Documentocument implements Serializable, Printable, Validatable {

    constructor(
        public title: string,
        public content: string
    ) {}

    // Serializable
    toJSON(): string {
        return JSON.stringify({
            title: this.title,
            content: this.content
        });
    }

    fromJSON(data: string): this {
        const parsed = JSON.parse(data);

        this.title = parsed.title;
        this.content = parsed.content;

        return this;
    }

    // Printable
    print(): void {
        console.log(this.content);
    }

    getDisplayName(): string {
        return this.title;
    }

    // Validatable
    validate(): ValidationResult {
        const errors: string[] = [];

        if (!this.title.trim()) {
            errors.push("Title is required");
        }

        if (!this.content.trim()) {
            errors.push("Content is required");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

