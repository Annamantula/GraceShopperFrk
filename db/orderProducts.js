const client = require("./client");
async function createOrderProduct({cart_products_id, order_id, product_id, count, purchase_price}) {
    try {
      const {
        rows: [order],
      } = await client.query(
        `
        INSERT INTO order_products (cart_products_id, order_id, product_id, count, purchase_price) 
        VALUES($1, $2, $3, $4, $5 )
        RETURNING  *;
      `,
        [cart_products_id, order_id, product_id, count, purchase_price]
      );
      return order;
    } catch (error) {
      console.error("CreateUsers errors");
      throw error;
    }
  }

  async function updateOrderProduct({id,...fields}) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
   try{ 
  const{ rows } =
      await client.query(
        `
        UPDATE order_products
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return rows[0];
     } catch (error) {
        console.error("There is an error in updateContacts");
         throw error;
   }
  }


  module.exports = {
    createOrderProduct,
    updateOrderProduct
  };