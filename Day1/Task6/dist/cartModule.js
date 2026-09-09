"use strict";
let cart = {
    items: [],
    total: 0
};
let observers = [];
function addItem(item, quantity) {
    const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity + quantity
    };
    cart.items.push(newItem);
    return newItem;
}
function removeItem(id) {
    cart.items = cart.items.filter(function (item) {
        return item.id !== id;
    });
}
function clearCart() {
    cart.items = [];
    cart.total = 0;
}
function getTotal() {
    return cart.total;
}
function getItems() {
    return cart.items;
}
function applyCoupon(coupon) {
    console.log(coupon.code);
    console.log(coupon.discount);
}
