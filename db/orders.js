const client = require("./client");

async function createOrder({customer_id, total_cost, delivery_date}) {
    try {
      const {
        rows: [order],
      } = await client.query(
        `
        INSERT INTO orders
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
     const {rows:[order] } = await client.query(`
     SELECT *
     FROM orders
     WHERE customer_id=$1
     `,[customer_id]);
     return order;
    }catch(error){
     console.error('Error getOrderByCustomerId')
     throw error;
     }
   }


  module.exports = {
    createOrder,
    updateOrder,
    getOrderByCustomerId
  };