
type Rule<T = unknown> = {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (v: T) => string | null;
};

type ValidationErrors<T extends Record<string, unknown>> =
    Partial<Record<keyof T, string>>;

type ValidationResult<T extends Record<string, unknown>> = {
    valid: boolean;
    errors: ValidationErrors<T>;
};

class FormValidator<T extends Record<string, unknown>> {
    private form: T;

    private rules: {
        [K in keyof T]?: Rule<T[K]>[];
    };

    constructor(
        form: T,
        rules: {
            [K in keyof T]?: Rule<T[K]>[];
        }
    ) {
        this.form = form;
        this.rules = rules;
    }

    public validate(): ValidationResult<T> {
        const errors: ValidationErrors<T> = {};

        for (const key of Object.keys(this.rules) as Array<keyof T>) {
            const fieldRules = this.rules[key];

            if (!fieldRules) {
                continue;
            }

            const value = this.form[key];

            for (const rule of fieldRules) {
                let error: string | null = null;

                // Required validation
                if (
                    rule.required &&
                    (value === undefined ||
                        value === null ||
                        value === "")
                ) {
                    error = "This field is required.";
                }

                // Minimum length validation
                if (
                    error === null &&
                    rule.minLength !== undefined &&
                    typeof value === "string" &&
                    value.length < rule.minLength
                ) {
                    error = `Minimum length is ${rule.minLength}.`;
                }

                // Pattern validation
                if (
                    error === null &&
                    rule.pattern !== undefined &&
                    typeof value === "string" &&
                    !rule.pattern.test(value)
                ) {
                    error = "Invalid format.";
                }

                // Custom validation
                if (error === null && rule.custom !== undefined) {
                    error = rule.custom(value);
                }

                if (error !== null) {
                    errors[key] = error;
                    break;
                }
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
}


// Example usage

type RegistrationForm = {
    name: string;
    email: string;
    password: string;
    age: number;
};

const form: RegistrationForm = {
    name: "Kajal",
    email: "kajal@gmail.com",
    password: "12345678",
    age: 20
};

const rules: {
    [K in keyof RegistrationForm]?: Rule<RegistrationForm[K]>[];
} = {
    name: [
        {
            required: true,
            minLength: 3
        }
    ],

    email: [
        {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    ],

    password: [
        {
            required: true,
            minLength: 8
        }
    ],

    age: [
        {
            required: true,
            custom: (value: number): string | null => {
                if (value < 18) {
                    return "Age must be at least 18.";
                }

                return null;
            }
        }
    ]
};

const validator = new FormValidator(form, rules);

const result: ValidationResult<RegistrationForm> =
    validator.validate();

console.log(result);

