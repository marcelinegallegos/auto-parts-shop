/**
 * Shopping Cart Model
 */

let cart = { parts: [], itemCount: 0, totalPrice: 0, totalWeight: 0 }
module.exports = class Cart {

    static save(part) {

        //if cart is empty, initialize it
        if (!cart) {    
            cart = { parts: [], itemCount: 0, totalPrice: 0, totalWeight: 0 }   
        }

        // check if the part is already in the cart
        const existingPart = cart.parts.find(cartPart => cartPart.number === part[0].number)

        if (existingPart) {
            existingPart.quantity += 1
        } else {
            part[0].quantity = 1
            cart.parts.push(part[0])
        }
    }

    static setQuantity(partNumber, quantity) {
        const indexOfPart = cart.parts.findIndex(p => p.number == partNumber)

        if (indexOfPart >= 0) {
            if (quantity == 0) {
                cart.parts.splice(indexOfPart, 1)[0]
            } else {
                cart.parts[indexOfPart].quantity = quantity
            }

        }
    }

    static getCart() {
        cart.itemCount = 0
        cart.subtotal = 0
        cart.shipping = 0

        for (part of cart.parts)
        {
            cart.itemCount += part.quantity
            cart.subtotal += part.price * part.quantity
        }

        cart.total = cart.subtotal + cart.shipping

        return cart;
    }

    static getInCartQuantity(partNumber) {
        const indexOfPart = cart.parts.findIndex(p => p.number == partNumber)
        if (indexOfPart >= 0) {
            return cart.parts[indexOfPart].quantity
        }
        return 0
    }

    static remove(partID) {
        
        const indexOfPart = cart.parts.findIndex(p => p.number == partID)

        if (indexOfPart >= 0) {
            const removedPart = cart.parts.splice(indexOfPart, 1)[0];
        }
    }   
}
