const client = require("./client");

async function createContactInfo({userId,first_name,last_name,phone,street,street_num,apt,city,zip }) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        INSERT INTO contacts(user_id,first_name,last_name,phone,street,street_num,apt,city,zip) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `,
        [userId,first_name,last_name,phone,street,street_num,apt,city,zip ]
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
  const{rows:[contact]} =
      await client.query(
        `
        UPDATE contacts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return contact;
     } catch (error) {
        console.log("There is an error in updateContacts");
         throw error;
   }
  }



  module.exports = {
    createContactInfo,
    updateContact,
  }