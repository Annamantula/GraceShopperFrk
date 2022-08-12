const express = require('express');
const productsRouter = express.Router();

const { createProduct, updateProduct } = require('../db/products');

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
        const productId = await getProductById(id);
        res.send(productId)
    }catch(error) {
        next(error)
    }
});

//POST product  
//price_type???
productsRouter.post("/", async (res,req,next) => {
    const {name, description, price, category,inventory,img_url} = req.body
    const newProduct = {};
    try{
        if(isAdmin === true) {
            newProduct.name = name;
            newProduct.description = description;
            newProduct.price = price;
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
    const { name, description,price, category,inventory,img_url } = req.body;
    try { 
        if(isAdmin === true) {
      const updatedProduct = await updateProduct({name, description,price, category,inventory,img_url,id });
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        next({
          name: "UnauthorizedUserError",
          message: "Product not found",
        });
      }}
    } catch ({ name, message }) {
      next({ name, message });
  }
});


//Delete
productsRouter.delete("/:product_id", async (res,req,next) => {
try{
    if(isAdmin === true) {
    const id = req.params.product_id;
    const product = await getProductById(id);
    if (product.user_id != req.user.id) {
      res.status(403);
      next({
        name: "Error",
        message: `User is not allowed to delete ${product.name}`,
      });
    }else{
    const deletedProduct = await deleteProduct(product.id);
    console.log(deletedProduct, "THIS IS DELETED PRODUCT")
    res.send(product);
    }}
}catch ({ name, message }) {
    next({ name, message });
}
})




module.exports = productsRouter;