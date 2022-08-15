const express = require("express");
const customersRouter = express.Router();

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
    const email = req.params.email
    try {
      if (req.user) {
        if (req.user.isAdmin === true) {
          const customerByEmail = await getContactByEmail(email);
          res.send(customerByEmail);

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


module.exports = customersRouter;
