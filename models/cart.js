/**
 * Shopping Cart Model
 */

let cart = null;
module.exports = class Cart {

    static save(part) {

        //if cart is empty, initialize it
        if (!cart) {    
            cart = { parts: [], totalPrice: 0 };    
        }

        const price = part[0].price;

        // check if the part is already in the cart
        const existingPart = cart.parts.find(cartPart => cartPart.number === part[0].number);

        if (existingPart) {
            existingPart.quantity += 1;
        } else {
            part[0].quantity = 1;
            cart.parts.push(part[0]);
        }
        cart.totalPrice += price;
    }

    static getCart() {
        return cart;
    }
};
