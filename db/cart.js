const client = require('./client');
const { dropTables, createTables, rebuildDB } = require('./seedData')

async function createGuestCart(code) {
    try {
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

async function createCart({...fields}) {
    const keys = Object.keys(fields)
    .map((key) => `${key}`)
    .join(", ");
    const binds = Object.keys(fields).map((_, index) => `$${index + 1}`).join(', ');

   try{ 
  const{ rows } =
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

  //NOTE: Be sure to import to index

  module.exports = {
    createCart,
    createGuestCart
  }