const client = require("./client");

// const bcrypt = require("bcrypt");

async function createUser({ email, password, isAdmin }) {
    // const SALT_COUNT = 10;
    // const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        INSERT INTO users(email, password, "isAdmin") 
        VALUES($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING  email, id;
      `,
        [email, password, isAdmin]
      );
      return user;
    } catch (error) {
      console.error("CreateUsers errors");
      throw error;
    }
  }

  async function getUser({ email, password }) {
    const user = await getUserByEmail(email);
    const dbpassword = user.password
    // const hashedPassword = user.password;
    // const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (dbpassword === password) {
    delete user.password;
    return user;
    } 
    else if(dbpassword !== password) {
      return ;
    }
    else {
      throw console.error("Thers an error in GetUser");
    }
    
  }

  async function getAllUsers() {
    try {
      const {rows} = await client.query(`
       SELECT * FROM users
      `)
      return rows
    } catch(error){
      throw error
    }
  }

async function getUserById(userId) {
    // eslint-disable-next-line no-useless-catch
    try{
     const {rows:[user] } = await client.query(`
     SELECT id, email
     FROM users
     WHERE id=$1
     `,[userId]);
     return user;
    }catch(error){
     console.error('Error getUserById')
     throw error;
     }
   }

   async function getUserByEmail(email) {
    // eslint-disable-next-line no-useless-catch
    try{
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT *
        FROM users
        WHERE email=$1;
      `,
        [email]
      );
      return user;
      }catch(error){
        console.error('Error getUserByUsername')
        throw error;
        }
  }

  module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByEmail,
    getAllUsers
  };