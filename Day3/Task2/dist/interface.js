"use strict";
// 5. Document implements all 3 interfaces
class Documentocument {
    title;
    content;
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
    // Serializable
    toJSON() {
        return JSON.stringify({
            title: this.title,
            content: this.content
        });
    }
    fromJSON(data) {
        const parsed = JSON.parse(data);
        this.title = parsed.title;
        this.content = parsed.content;
        return this;
    }
    // Printable
    print() {
        console.log(this.content);
    }
    getDisplayName() {
        return this.title;
    }
    // Validatable
    validate() {
        const errors = [];
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
