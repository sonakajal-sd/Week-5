abstract class Shape{
    abstract area():number;
    abstract perimeter():number;

    describe():void{
        console.log(`Area: ${this.area()}`);
        console.log(`Perimeter:${this.perimeter()}`);
    }
}

class Circle extends Shape{
    constructoe(public radius:number){
        super();
    }

    area():number{
        return Math.PI *this.radius **2;
    }
    perimeter(): number {
        return 2*Math.PI *this.radius
    }
}