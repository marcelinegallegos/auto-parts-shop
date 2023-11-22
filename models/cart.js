// class cart
// class Cart {
//     constructor() {
//         this.cart = { parts: [], totalPrice: 0 };
//     }

//     save(part) {
//         part.quantity = 1;
//         this.cart.parts.push(part);
//         this.cart.totalPrice += part.price;
//     }

//     getCart() {
//         return this.cart;
//     }
// }

// module.exports = Cart;


let cart = null;

module.exports = class Cart {

    static save(part) {
        if (cart) {

        }
        else {
            cart = { parts: [], totalPrice: 0 };
            part.quantity = 1;
            cart.parts.push(part);
            cart.totalPrice = part.price;
        }
    }

    static getCart() {
        return cart;
    }
}