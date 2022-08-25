const client = require('./client');

async function getGuestCartByCode(code) {
    try {
        const { rows } = await client.query(
            `
            SELECT *
            FROM guest_cart
            WHERE code=$1;
          `, [code]
        )
        return rows[0];
    }
    catch (error) {
        console.error("Error creating guest cart");
        throw error;
    }
}

async function createGuestCart() {
    possibleVal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codeTest = {};
    let code = "";
    try {
        do {
            codeTest = {};
            code = "";
            for (let i = 0; i < 21; i++) {
                randNum = Math.round(Math.random()*(possibleVal.length-1));
                code += possibleVal[randNum]
            }
            codeTest = await getGuestCartByCode(code);
        } while (codeTest);
        const { rows } = await client.query(
            `
            INSERT INTO guest_cart (code)
            VALUES ($1)
            RETURNING *;
            `, [code]
        );
        return rows[0];
    } catch (error) {
        console.error('Error creating cart')
        throw error
    }
}

async function createCart({ ...fields }) {
    const keys = Object.keys(fields)
        .map((key) => `${key}`)
        .join(", ");
    const binds = Object.keys(fields).map((_, index) => `$${index + 1}`).join(', ');

    try {
        const { rows } =
            //ON CONFLICT (user_id, guest_cart_id) DO NOTHING
            await client.query(
                `
        INSERT INTO cart(${keys})
        VALUES (${binds})
        RETURNING *;
      `,
                Object.values(fields)
            );
        return rows[0];
    } catch (error) {
        console.error("There is an error");
        throw error;
    }
}

async function getCartByUserId(user_id) {
    try {
        const {
            rows: [cart],
        } = await client.query(
            `
        SELECT *
        FROM cart
        WHERE user_id=$1;
      `,
            [user_id]
        );

        return cart;
    } catch (error) {
        console.error("Failed to get cart!");
        throw error;
    }
}

async function getCartByGuestId(guest_cart_id) {
    try {
        const {
            rows: [cart],
        } = await client.query(
            `
        SELECT *
        FROM cart
        WHERE guest_cart_id=$1;
      `,
            [guest_cart_id]
        );

        return cart;
    } catch (error) {
        console.error("Failed to get cart!");
        throw error;
    }
}

async function attachCartProductsToCart(cart) {
    const cartToReturn = cart; 
    const cartId = cart.id;

    if (!cart.id) 
        return [];

    try {
        const { rows: cart_products } = await client.query(
            `     
             SELECT products.*, cart_products.count, cart_products.id 
             AS "cartProductId", cart_products.cart_id      
             FROM products       
             JOIN cart_products ON cart_products.product_id = products.id      
             WHERE cart_products.cart_id IN ($1);    
            `, [cartId]);
        const cartProductsToAdd = cart_products.filter((cart_product) => cart_product.cart_id === cartId);
        cartToReturn.products = cartProductsToAdd;
        return cartToReturn;
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    createCart,
    createGuestCart,
    getCartByUserId,
    getCartByGuestId,
    attachCartProductsToCart,
    getGuestCartByCode
}