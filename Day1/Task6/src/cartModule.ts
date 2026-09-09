interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Cart {
    items: CartItem[];
    total: number;
}

interface Coupon {
    code: string;
    discount: number;
}

let cart: Cart = {
    items: [],
    total: 0
};

let observers: Array<(state: Cart) => void> = [];

function addItem(item: CartItem, quantity: number): CartItem {
    const newItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity + quantity
    };

    cart.items.push(newItem);

    return newItem;
}

function removeItem(id: number): void {
    cart.items = cart.items.filter(function (item) {
        return item.id !== id;
    });
}

function clearCart(): void {
    cart.items = [];
    cart.total = 0;
}

function getTotal(): number {
    return cart.total;
}

function getItems(): CartItem[] {
    return cart.items;
}

function applyCoupon(coupon: Coupon): void {
    console.log(coupon.code);
    console.log(coupon.discount);
}