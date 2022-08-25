const express = require('express');
const router = express.Router();
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');



router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
  
    if (!auth) {
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
     
        if (id) {
          req.user = await getUserById(id);   
          next();
        }
      } catch ({ error, name, message }) {
        next({ error, name, message });
      }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`,
          });
    }
  });

  router.use((req, res, next) => {
    if (req.user) {
      // console.log("User is set:", req.user);
    }
  
    next();
  });

  router.get('/health', async (req, res, next) => {
    try {
        res.send({message:"Server is up!"})
    }
    catch(error){
        next(error)
    }
});

//Users Router
const usersRouter = require('./users');
router.use('/users', usersRouter);
// router.use('/users/login', usersRouter);
// router.use('/users/register', usersRouter);
// router.use('/users/me', usersRouter);
// router.use('/users/:user_id', usersRouter);


//Products Router
const productsRouter = require('./products');
router.use('/products', productsRouter); //POST Admin
// router.use('/products/cart/:product_id/:cart_id', productsRouter);
// router.use('/products/:product_id', productsRouter); 


//Cart Router
const cartRouter = require('./cart');
router.use('/cart', cartRouter);
// router.use('/cart/guest', cartRouter);
// router.use('/cart/users', cartRouter);
// router.use('/cart/guest/:code', cartRouter);
// router.use('/cart/users/:user_id', cartRouter);
// router.use('/cart/checkout', cartRouter);


//Orders Router
const ordersRouter = require('./orders');
router.use('/orders', ordersRouter); //Admin
// router.use('/orders/users/:user_id', ordersRouter);
// router.use('/orders/:customer_id', ordersRouter); //Admin

//Customers Router
const customersRouter = require('./customers');
router.use('/customers', customersRouter); //Admin
// router.use('/customers/:customer_id', customersRouter); //Admin

module.exports = router;