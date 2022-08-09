const { Client } = require('pg');

async function testDB() {
    try {
      client.connect();
  
      const result = await client.query(`SELECT * FROM users;`);
  
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }
  }
  
  testDB();
  

  async function dropTables() {
    try {
    console.log("Dropping All Tables...")
    await client.query (`
        DROP TABLE IF EXISTS order_products;
        DROP TABLE IF EXISTS order;
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS guest_cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS contacts;
        DROP TABLE IF EXISTS users;
           
    `)
    console.log("Finished dropping tables")
    }catch(error){
      console.error("error dropping tables")
      throw error
    }
  }
  
  async function createTables() {
    try {
    console.log("Starting to build tables...")
    await client.query (`
    CREATE TABLE users( 
      id SERIAL PRIMARY KEY, 
      password VARCHAR(255) NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "isActive" BOOLEAN DEFAULT true,
      "isAdmin" BOOLEAN DEFAULT false
      );
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      category TEXT NOT NULL,
      inventory FLOAT,
      img_url VARCHAR(255)
      );
    CREATE TABLE contacts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone INT,
      street TEXT NOT NULL,
      street_num INT,
      apt VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      zip INT
      );
      CREATE TABLE guest_cart(
      id SERIAL PRIMARY KEY,
      code INT,
      );
      CREATE TABLE cart(
        id SERIAL PRIMARY KEY,
        guest_cart_id INT,
        user_id INTEGER REFERENCES users(id),
      );
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      UNIQUE (cart_id, product_id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      customer_id INT,
      delivery_date VARCHAR(255) NOT NULL
    );
    CREATE TABLE orders_products(
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      count FLOAT,
      purchase_price FLOAT
    );
  
   `)
   console.log("Finished building table")
    }catch(error){
      console.error("error building table")
      throw error
    }
  }



  async function rebuildDB() {
    try {
      await dropTables()
      await createTables()
      await createInitialUsers()
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }
  
  module.exports = {
    rebuildDB,
    dropTables,
    createTables,
  }