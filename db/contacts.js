const client = require("./client");

async function createContactInfo({userId,first_name,last_name,email,phone,street,street_num,apt,city,zip }) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        INSERT INTO contacts(user_id,first_name,last_name,email,phone,street,street_num,apt,city,zip) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `,
        [userId,first_name,last_name,email,phone,street,street_num,apt,city,zip ]
      );
      return user;
    } catch (error) {
      console.error("CreateContacts errors");
      throw error;
    }
  }

  async function updateContact({id,...fields}) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
   try{ 
  const{ rows } =
      await client.query(
        `
        UPDATE contacts
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

  async function getContactByEmail(email) {
    try{
      const {
        rows: [contact],
      } = await client.query(
        `
        SELECT *
        FROM contacts
        WHERE email=$1;
      `,
        [email]
      );
      return contact;
      }catch(error){
        console.error('Error getCointactByEmail')
        throw error;
        }
  }
  async function getAllContacts() {
    try {
      const {rows} = await client.query(`
       SELECT * FROM contacts
      `)
      return rows
    } catch(error){
      throw error
    }
  }

  async function getContactById(id){
    try{
      const {
        rows: [contact],
      } = await client.query(
        `
        SELECT *
        FROM contacts
        WHERE id=$1;
      `,
        [id]
      );
      return contact;
      }catch(error){
        console.error('Error getContactById')
        throw error;
        }

  }


  module.exports = {
    createContactInfo,
    updateContact,
    getContactByEmail,
    getAllContacts,
    getContactById
  }