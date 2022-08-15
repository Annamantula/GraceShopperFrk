const express = require('express');
const { getCartByUserId, createCartProducts, getCartByGuestId, getGuestCartByCode, attachCartProductsToCart, createGuestCart, createCart } = require('../db');
const cartRouter = express.Router();

cartRouter.get("/users/:user_id", async(req,res,next) => {
    try{
        if(req.user) {
            if(req.user.id === req.params.user_id || req.user.isAdmin === true) {
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

cartRouter.get("/guest/:code", async(req,res,next) => {
    try{
        const guestId = await getGuestCartByCode(req.params.code);
        const cart = await getCartByGuestId(guestId);
        res.send(cart);
    }
    catch(error) {
        next(error)
    }
});

//Cart products url
cartRouter.post("/users/:user_id", async(req,res,next) => {
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

cartRouter.post("/users", async(req,res,next) => {
    try{
      if(req.user) {
        const cart = await createCart({user_id: req.user.id});
        req.send(cart);
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

cartRouter.post("/guest", async(req,res,next) => {
    try{
        const code = await createGuestCart();
        const cart = await createCart({code});
    res.send(cart);
}
    catch(error) {
        next(error)
    }
})

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

module.exports = cartRouter;