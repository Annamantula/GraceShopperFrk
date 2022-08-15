const client = require("./client");

async function createOrder({customer_id, total_cost, delivery_date}) {
    try {
      const {
        rows: [order],
      } = await client.query(
        `
        INSERT INTO orders(customer_id, total_cost, delivery_date)
        VALUES($1, $2, $3)
        RETURNING  *;
      `,
        [customer_id, total_cost, delivery_date]
      );
      return order;
    } catch (error) {
      console.error("CreateOrders errors");
      throw error;
    }
  }

  async function updateOrder({id,...fields}) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
   try{ 
  const{ rows } =
      await client.query(
        `
        UPDATE orders
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return rows[0];
     } catch (error) {
        console.error("There is an error in updateOrders");
         throw error;
   }
  }


  async function getOrderByCustomerId(customer_id) {
    try{
     const {rows } = await client.query(`
     SELECT *
     FROM orders
     WHERE customer_id=$1
     `,[customer_id]);
     return rows;
    }catch(error){
     console.error('Error getOrderByCustomerId')
     throw error;
     }
   }

   async function attachOrderProductsToOrder(order) {
    const orderToReturn = order; 
    const orderId = order.id;

    if (!order.id) 
        return [];

    try {
        const { rows: order_products } = await client.query(
            `     
             SELECT products.*, orders_products.count, orders_products.id 
             AS "orderProductId", orders_products.order_id      
             FROM products       
             JOIN orders_products ON orders_products.product_id = products.id      
             WHERE orders_products.order_id IN ($1);    
            `, [orderId]);
        const orderProductsToAdd = order_products.filter((order_product) => order_product.order_id === orderId);
        orderToReturn.products = orderProductsToAdd;
        return orderToReturn;
    } catch (error) {
        console.error(error);
    }
}
const getAllOrders = async () => {
    try {
      const { rows } = await client.query(
        `SELECT id, customer_id, delivery_date, total_cost
        FROM orders;`
      );
      const orderWithDetails = addDetailsToOrders(rows);
      return orderWithDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  module.exports = {
    createOrder,
    updateOrder,
    getOrderByCustomerId,
    attachOrderProductsToOrder
  };