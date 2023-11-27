/**
 * Shopping Cart Model
 */

let cart = { parts: [], totalPrice: 0 };
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
        // Round totalPrice to two decimals
        cart.totalPrice = Number(cart.totalPrice.toFixed(2));
    }

    static getCart() {
        return cart;
    }

    static remove(partID) {
        
        const indexOfPart = cart.parts.findIndex(p => p.number == partID);

        if (indexOfPart >= 0) {
            const removedPart = cart.parts.splice(indexOfPart, 1)[0];
            cart.totalPrice -= removedPart.price * removedPart.quantity;
            cart.totalPrice = Number(cart.totalPrice.toFixed(2));
        }
    }

    static increment(partID) {
        const indexOfPart = cart.parts.findIndex(p => p.number == partID);

        if (indexOfPart >= 0) {
            cart.parts[indexOfPart].quantity += 1;
            cart.totalPrice += cart.parts[indexOfPart].price;
            cart.totalPrice = Number(cart.totalPrice.toFixed(2));
        }
    }

    static decrement(partID) {
        const indexOfPart = cart.parts.findIndex(p => p.number == partID);

        if (indexOfPart >= 0) {
            if (cart.parts[indexOfPart].quantity > 1) {
                cart.parts[indexOfPart].quantity -= 1;
                cart.totalPrice -= cart.parts[indexOfPart].price;
            }
            //if quantity is 1, remove on item on decrement
            if (cart.parts[indexOfPart].quantity == 1) {    
                const removedPart = cart.parts.splice(indexOfPart, 1)[0];
                cart.totalPrice -= removedPart.price * removedPart.quantity;
            }
        }
        cart.totalPrice = Number(cart.totalPrice.toFixed(2));
    }
};
