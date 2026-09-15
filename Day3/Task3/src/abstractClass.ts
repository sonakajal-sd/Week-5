
abstract class Shape {
    abstract area(): number;
    abstract perimeter(): number;

    describe(): string {
        return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
    }

    static create(
        type: "circle" | "rect" | "triangle",
        ...args: number[]
    ): Shape {
        switch (type) {
            case "circle":
                return new Circle(args[0]);

            case "rect":
                return new Rectangle(args[0], args[1]);

            case "triangle":
                return new Triangle(args[0], args[1], args[2]);

            default:
                throw new Error(`Unknown shape type: ${type}`);
        }
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(
        private width: number,
        private height: number
    ) {
        super();
    }

    area(): number {
        return this.width * this.height;
    }

    perimeter(): number {
        return 2 * (this.width + this.height);
    }
}

class Triangle extends Shape {
    constructor(
        private a: number,
        private b: number,
        private c: number
    ) {
        super();
    }

    area(): number {
        const s = (this.a + this.b + this.c) / 2;
        return Math.sqrt(
            s * (s - this.a) * (s - this.b) * (s - this.c)
        );
    }

    perimeter(): number {
        return this.a + this.b + this.c;
    }
}

// Abstract classes cannot be instantiated
// const shape = new Shape(); // ❌ TypeScript error

// Direct creation
const circle = new Circle(5);
console.log("Circle:", circle.describe());

const rectangle = new Rectangle(10, 5);
console.log("Rectangle:", rectangle.describe());

const triangle = new Triangle(3, 4, 5);
console.log("Triangle:", triangle.describe());

// Static factory
const shape1 = Shape.create("circle", 5);
const shape2 = Shape.create("rect", 10, 5);
const shape3 = Shape.create("triangle", 3, 4, 5);

console.log("Factory Circle:", shape1.describe());
console.log("Factory Rectangle:", shape2.describe());
console.log("Factory Triangle:", shape3.describe());

