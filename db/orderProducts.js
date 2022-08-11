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
      console.error("CreateOrderProduct errors");
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
        console.error("There is an error in updateOrderProduct");
         throw error;
   }
  }

  async function getOrderProductsByOrderId(order_id) {
    try{
     const {rows:[order_products] } = await client.query(`
     SELECT *
     FROM order_products
     WHERE order_id=$1
     `,[order_id]);
     return order_products;
    }catch(error){
     console.error('Error getOrderProductsByOrderId')
     throw error;
     }
   }


  module.exports = {
    createOrderProduct,
    updateOrderProduct,
    getOrderProductsByOrderId
  };