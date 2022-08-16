const express = require('express');
const { getOrderByCustomerId, createOrder, attachOrderProductsToOrder } = require('../db');
const ordersRouter = express.Router();


//api/orders/:byOrderId
// ordersRouter.get("/:", async(req,res,next) => {
//     try{
//         const id = req.params.order_id;
//         const orderId = await getOrderProductsByOrderId(id);
//         res.send(orderId)
//     }catch(error) {
//         next(error)
//     }
// });


// ordersRouter.post("/users/:user_id", async(req,res,next) => {
//     try{
//     const order = req.params.order_id;
//     const product_id = req.params.product_id;
//     const  {count} = req.body;
//     const addProductToOrder = await createOrderProduct({order, product_id, count, purchase_price});
//     res.send(addProductToOrder);
// }
//     catch(error) {
//         next(error)
//     }
// })


//api/orders
// ordersRouter.get("/", async (req,res,next)=>{
//     const {customer_id,delivery_date, total_cost} = req.params
//     try{
//         const order = await createOrder(customer_id,delivery_date, total_cost);
//         res.send(order)
//     }catch(error){
//         next( error)
//     }
// })


//api/orders/customer_id
ordersRouter.get("/:customer_id", async(req,res,next) => {
        try{
            const id = req.params.customer_id;
            const orderId = await getOrderByCustomerId(id);
            res.send(orderId)
        }catch(error) {
            next(error)
        }
    })


module.exports = ordersRouter;