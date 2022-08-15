const express = require("express");
const customersRouter = express.Router();
const {getContactById,getAllContacts,getContactByEmail,createContactInfo} = require("../db");

// Get all customers
customersRouter.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.isAdmin === true) {
        const allCustomers = await getAllContacts();
        res.send(allCustomers);
      } else {
        next({
          name: "AdministratorAccessError",
          message: "You do not have administrator access",
        });
      }
    } else {
      next({
        name: "UserAccessError",
        message: "You must be logged in to perform this action",
      });
    }
  } catch (error) {
    next(error);
  }
});

// get customers/:customer_id

customersRouter.get("/:customer_id", async (req, res, next) => {
  const id = req.params.customer_id;
    try {
      if (req.user) {
        if (req.user.isAdmin === true) {
          const customerById = await getContactById(id);
          res.send(customerById);

        } else {
          next({
            name: "AdministratorAccessError",
            message: "You do not have administrator access",
          });
        }
      } else {
        next({
          name: "UserAccessError",
          message: "You must be logged in to perform this action",
        });
      }
    } catch (error) {
      next(error);
    }
  });


  // POST creating new customer 

  customersRouter.post("/", async (req, res, next) => {
    const {first_name,last_name,email,phone,street,street_num,apt,city,zip } = req.body;
    try {
      // const _customer = await getContactByEmail(email);
      // if (_customer) {
      //   res.status(401);
      //   next({
      //     name: "UserExistsError",
      //     message: `User ${email} is already taken.`,
      //   });
      // }
      const customer = await createContactInfo ({first_name,last_name,email,phone,street,street_num,apt,city,zip});
      res.send(customer)
      
    } catch ({ error, name, message }) {
      next({ error,name, message });
    }
  });


module.exports = customersRouter;
