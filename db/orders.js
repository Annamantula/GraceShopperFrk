const client = require("./client");

async function createOrder({customer_id, total_cost}) {
    try {
      const {
        rows: [order],
      } = await client.query(
        `
        INSERT INTO orders(customer_id, total_cost) 
        VALUES($1, $2)
        ON CONFLICT (customer_id) DO NOTHING
        RETURNING  *;
      `,
        [customer_id, total_cost]
      );
      return order;
    } catch (error) {
      console.error("CreateUsers errors");
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
        console.error("There is an error in updateContacts");
         throw error;
   }
  }
  
//checkout?

  module.exports = {
    createOrder,
    updateOrder
 
  };