const client = require('./client');

async function createCartProducts({cart_id, product_id, count}) {
    try {
       const { rows } = await client.query(
        `
        INSERT INTO cart_products(cart_id, product_id, count)
        VALUES ($1, $2, $3)
        RETURNING *;
        `, [cart_id, product_id, count]
       )
    return rows;

   } catch (error) {
    console.error("error")
    throw error
   }
}

async function deleteCartProduct(cart_products_id) {
    try {
       const { rows } = await client.query(
        `
        DELETE FROM cart_products
        WHERE id=$1
        RETURNING *;
        `, [cart_products_id]
       )
    return rows[0];

   } catch (error) {
    console.error("error")
    throw error
   }
}
async function deleteCartProducts(cart_id) {
   try {
      const { rows } = await client.query(
       `
       DELETE FROM cart_products
       WHERE cart_id=$1
       RETURNING *;
       `, [cart_id]
      )
      console.log(rows);
   return rows;

  } catch (error) {
   console.error("error")
   throw error
  }
}

async function updateCartProducts({id,...fields}) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
   try{ 
  const{ rows } =
      await client.query(
        `
        UPDATE cart_products
        SET ${setString}
        WHERE id=${id}
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

  module.exports = {
    createCartProducts,
    updateCartProducts,
    deleteCartProducts
  }
