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
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS activities;
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
      username VARCHAR(255) UNIQUE NOT NULL, 
      password VARCHAR(255) NOT NULL
      );
    CREATE TABLE activities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL
      );
    CREATE TABLE routines (
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id),
      "isPublic" BOOLEAN DEFAULT false,
      name VARCHAR(255) UNIQUE NOT NULL,
      goal TEXT NOT NULL
      );
    CREATE TABLE routine_activities(
      id SERIAL PRIMARY KEY,
      "routineId" INTEGER REFERENCES routines(id),
      "activityId" INTEGER REFERENCES activities(id),
      duration INTEGER, 
      count INTEGER,
      UNIQUE ("routineId", "activityId")
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