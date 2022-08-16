const express = require('express');
const { getCartByUserId, createCartProducts, getCartByGuestId, getGuestCartByCode, attachCartProductsToCart, createGuestCart, createCart, createOrder, getContactByEmail, createOrderProduct, getProductById, updateOrder, attachOrderProductsToOrder } = require('../db');
const cartRouter = express.Router();

// POST /api/cart/guest Create Guest Cart
cartRouter.post("/guest", async(req,res,next) => {
  try{
      const code = await createGuestCart();
      const cart = await createCart({guest_cart_id: code.id});
  res.send(code);
}
  catch(error) {
      next(error)
  }
})

//Post /api/cart/users Create User Cart
cartRouter.post("/users", async(req,res,next) => {
  try{
    if(req.user) {
      const cart = createCart({ user_id: req.user.id });
      res.send(cart);
    }
    else {
      next({
        name: "UserLoginError",
        message: "You must be logged in to do this"
      })
    }
}
  catch(error) {
      next(error)
  }
})

//GET /api/cart/guest/:code Get Guest Cart
cartRouter.get("/guest/:code", async(req,res,next) => {
  try{
      const guestId = await getGuestCartByCode(req.params.code);
      const cart = await getCartByGuestId(guestId.id);
      const cartWithProducts = await attachCartProductsToCart(cart);
      res.send(cart);
  }
  catch(error) {
      next(error)
  }
});

//POST /api/cart/guest/:code Add Items To Guest Cart
cartRouter.post("/guest/:code", async(req,res,next) => {
  try{
      const cart = req.params.cart_id;
      const product_id = req.params.product_id;
      const  {count} = req.body;
      const addProductToCart = await createCartProducts({cart, product_id, count});
      res.send(addProductToCart);
  }
  catch(error) {
      next(error)
  }
})

//PATCH /api/cart/guest/:code Edit Guest Cart Items
cartRouter.patch("/guest/:code", async (res,req,next) =>{
  const id = req.params.product_id;
  const { name, description,price,price_type, category,inventory,img_url } = req.body;
  try { 
      if(req.user) {
      if(req.user.isAdmin  === true) {
      const originalProduct = await getProductById(id);

      if (!originalProduct) {
        next({
          name: "originalProduct",
          message: `Product ${id} not found`,
        });
        return;
      }

    const updatedProduct = await updateProduct({name, description,price,price_type, category,inventory,img_url,id });

    if (updatedProduct) {
      res.send(updatedProduct);
    }} else {
      next({
        name: "UnauthorizedUserError",
        message: "Product not updated",
      });
    }}else{
      next({
          name: "UnauthorizedUserError",
          message: "Not logged in user",
        });
    }
  } catch ({ name, message }) {
    next({ name, message });
}
});

//GET /api/cart/users/:user_id Get User Cart
cartRouter.get("/users/:user_id", async(req,res,next) => {
    try{
        if(req.user) {
            if(req.user.id == req.params.user_id || req.user.isAdmin === true) {
                const cart = await getCartByUserId(req.params.user_id);
                const cartWithProducts = await attachCartProductsToCart(cart);
                res.send(cartWithProducts);
            } else {
                next({
                    name: "UnauthorizedUserError",
                    message: "You are not authorized to see this.",
                  });
            }
        } else {
            next({
                name: "UnauthorizedUserError",
                message: "Must be logged in to access this.",
              });
        }
    }
    catch(error) {
        next(error)
    }
});


//Cart products url
//UNFINISHED already exists in products
//POST /api/cart/users/:user_id Add Items To User Cart
cartRouter.post("/users/:user_id", async(req,res,next) => {
    try{
    const cart = req.params.cart_id;
    const  {count} = req.body;
    const addProductToCart = await createCartProducts({cart, product_id, count});
    res.send(addProductToCart);
}
    catch(error) {
        next(error)
    }
})

//PATCH /api/cart/users/:user_id Edit User Cart Items
cartRouter.patch("/users/:user_id", async (res,req,next) =>{
    const id = req.params.product_id;
    const { name, description,price,price_type, category,inventory,img_url } = req.body;
    try { 
        if(req.user) {
            if(req.user.isAdmin  === true) {
                const originalProduct = await getProductById(id);
                
        if (!originalProduct) {
          next({
            name: "originalProduct",
            message: `Product ${id} not found`,
          });
          return;
        }

      const updatedProduct = await updateProduct({name, description,price,price_type, category,inventory,img_url,id });

      if (updatedProduct) {
        res.send(updatedProduct);
      }} else {
        next({
          name: "UnauthorizedUserError",
          message: "Product not updated",
        });
      }}else{
        next({
            name: "UnauthorizedUserError",
            message: "Not logged in user",
          });
      }
    } catch ({ name, message }) {
      next({ name, message });
  }
});

// //POST /api/cart/checkout Checkout Cart/Create Order
cartRouter.post("/checkout", async (req,res,next) =>{
  try {
    console.log (req.user, "req.userrrrrrr")
    if(req.user) {
      console.log(req.user.id, "req.user.idddddddd")
     const cart = await getCartByUserId(req.user.id);
     const contact = await getContactByEmail(req.user.email);
     console.log (contact, "contactttt")
     console.log (cart, "caaaaaart")
     const cartWithProducts = await attachCartProductsToCart(cart);
    
     const order = await createOrder({customer_id: contact.id, total_cost: 0, delivery_date: "Sep 3, 2022"});
     console.log(order.id, "order.idorder.idorder.id")
     console.log(order, "order from cart.jssss")
     let total = 0;
     await cartWithProducts.products.map(async (product) => {
       console.log (product, "prrrrdct")
      // productList = await getProductById(product.id);
      // console.log(productList, "productLiiiist")
      const createdProduct=  await createOrderProduct({ order_id: order.id, product_id: product.id, count: product.count , purchase_price: product.price });
     console.log(createdProduct , "createdProductttttt")
      total += (product.price * product.count);
     });
     console.log ( "1111111")
     const updatedOrder = await updateOrder({id: order.id, total_cost: total});
     console.log ( "222222")
     const updatedOrderWithProducts = await attachOrderProductsToOrder(updatedOrder);
     console.log ( "333333")
     res.send (updatedOrderWithProducts);
    }
    else if (req.body && req.body.code & req.body.contact_id) {
      const guestId = await getGuestCartByCode(req.body.code);
      const contact = await getContactById(req.body.contact_id);
      const cart = await getCartByGuestId(guestId);
      const cartWithProducts = await attachCartProductsToCart(cart);
    
     const order = await createOrder({customer_id: contact.id, total_cost: 0, delivery_date: "Sep 3, 2022"});
     console.log(order.id, "order.idorder.idorder.id")
     console.log(order, "order from cart.jssss")
     let total = 0;
     cartWithProducts.products.map(async (product) => {
       console.log (product, "prrrrdct")
      // productList = await getProductById(product.id);
      // console.log(productList, "productLiiiist")
      await createOrderProduct({ order_id: order.id, product_id: product.id, count: product.count , purchase_price: product.price });
      total += (product.price * product.count);
     });
     const updatedOrder = await updateOrder({id: order.id, total_cost: total});
     const updatedOrderWithProducts = await attachOrderProductsToOrder(updatedOrder);
     res.send (updatedOrderWithProducts);
    }
    else{
      next({
        name: "InfoError",
        message: "Insufficient info was shared",
      })
    }
  
  } catch (error) {
    next(error);
}
});





module.exports = cartRouter;








// cartRouter.post("/checkout", async (req,res,next) =>{
//   try {
//     console.log (req.user, "req.userrrrrrr")
//     if(req.user) {
//       console.log(req.user.id, "req.user.idddddddd")
//      const cart = await getCartByUserId(req.user.id);
//      const contact = await getContactByEmail(req.user.email);
//      console.log (contact, "contactttt")
//      console.log (cart, "caaaaaart")
//      const cartWithProducts = await attachCartProductsToCart(cart);
    
//      const order = await createOrder({customer_id: contact.id, total_cost: 0, delivery_date: "Sep 3, 2022"});
//      return order;
//     }
//     else if (req.body && req.body.code & req.body.contact_id) {
//       const guestId = await getGuestCartByCode(req.body.code);
//       const contact = await getContactById(req.body.contact_id);
//       const cart = await getCartByGuestId(guestId);
//       const cartWithProducts = await attachCartProductsToCart(cart);
    
//       const order = await createOrder({customer_id: contact.id, total_cost: 0, delivery_date: "Sep 3, 2022"});
//       return order;
//     }
//     else{
//       next({
//         name: "InfoError",
//         message: "Insufficient info was shared",
//       })
//     }
  
//   } catch (error) {
//     next(error);
// }
// });