"use strict";
class FormValidator {
    form;
    rules;
    constructor(form, rules) {
        this.form = form;
        this.rules = rules;
    }
    validate() {
        const errors = {};
        for (const key of Object.keys(this.rules)) {
            const fieldRules = this.rules[key];
            if (!fieldRules) {
                continue;
            }
            const value = this.form[key];
            for (const rule of fieldRules) {
                let error = null;
                // Required validation
                if (rule.required &&
                    (value === undefined ||
                        value === null ||
                        value === "")) {
                    error = "This field is required.";
                }
                // Minimum length validation
                if (error === null &&
                    rule.minLength !== undefined &&
                    typeof value === "string" &&
                    value.length < rule.minLength) {
                    error = `Minimum length is ${rule.minLength}.`;
                }
                // Pattern validation
                if (error === null &&
                    rule.pattern !== undefined &&
                    typeof value === "string" &&
                    !rule.pattern.test(value)) {
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
const form = {
    name: "Kajal",
    email: "kajal@gmail.com",
    password: "12345678",
    age: 20
};
const rules = {
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
            custom: (value) => {
                if (value < 18) {
                    return "Age must be at least 18.";
                }
                return null;
            }
        }
    ]
};
const validator = new FormValidator(form, rules);
const result = validator.validate();
console.log(result);
