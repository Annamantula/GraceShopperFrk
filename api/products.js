const express = require('express');
const { createCartProducts } = require('../db');
const productsRouter = express.Router();

const { createProduct, updateProduct, getProductById,deleteProduct, getAllProducts } = require('../db/products');

//get all products
productsRouter.get("/", async(req,res,next) => {
    try{
        const products = await getAllProducts();
        res.send(products);
    }catch(error) {
        next(error)
    }
});

//get product by ID
productsRouter.get("/:product_id", async(req,res,next) => {
    try{
        const id = req.params.product_id
        const productId = await getProductById(id);
        res.send(productId)
    }catch(error) {
        next(error)
    }
});

//POST product  
//price_type???
productsRouter.post("/", async (res,req,next) => {
    const {name, description, price, price_type, category,inventory,img_url} = req.body
    const newProduct = {};
    try{
        if(req.user.isAdmin === true) {
            newProduct.name = name;
            newProduct.description = description;
            newProduct.price = price;
            newProduct.price_type = price_type;
            newProduct.category = category;
            newProduct.inventory = inventory;
            newProduct.img_url = img_url;
            const createdProduct = await createProduct(newProduct)
            res.send(createdProduct);
        }
    }catch(error) {
        next(error)
    }
});

//Update Product
productsRouter.patch("/:product_id", async (res,req,next) =>{
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


//Delete
productsRouter.delete("/:product_id", async (res,req,next) => {
try{
    if(req.user) {
    if(req.user.isAdmin  === true) {
    const id = req.params.product_id;
    const product = await getProductById(id);
    const deletedProduct = await deleteProduct(product.id);
    console.log(deletedProduct, "THIS IS DELETED PRODUCT")
    res.send(deletedProduct);
    }else{
      res.status(403);
      next({
        name: "Error",
        message: `User  ${req.user.email}is not allowed to delete ${product.name}`,
      });
    }
}
}catch ({ name, message }) {
    next({ name, message });
}
});



//POST create product in cart
productsRouter.post("/:product_id/:cart_id", async(req,res,next) => {
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




module.exports = productsRouter;