let cart = null;
module.exports = class Cart {

    static save(part) {

        if (cart) { //if cart is not empty

        }
        else {  //if cart is currently empty

            //initialize empty cart
            cart = { parts: [], totalPrice: 0 };   
            part.quantity = 1;

            //add part to the array of parts
            cart.parts.push(part);  

            const price = part[0].price;
            console.log('Price:', price);

            
            cart.totalPrice = price;
            
            console.log("Part price:", part.price);
            console.log("Part: ", part)
        }
    }

    static getCart() {
        return cart;
    }
}