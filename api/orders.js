const express = require('express');
const { getOrderByCustomerId, createOrder, attachOrderProductsToOrder } = require('../db');
const ordersRouter = express.Router();

//api/order
// ordersRouter.get("/", async (req,res,next)=>{
//     const {order_id, product_id, count, purchase_price} = req.params
//     try{
//         const order = await createOrderProduct(order_id, product_id, count, purchase_price);
//         res.send(order)
//     }catch(error){
//         next( error)
//     }
// })
// //api/orders/:byOrderId
// ordersRouter.get("/:", async(req,res,next) => {
//     try{
//         const id = req.params.order_id;
//         const orderId = await getOrderProductsByOrderId(id);
//         res.send(orderId)
//     }catch(error) {
//         next(error)
//     }
// });



//api/orders
ordersRouter.get("/", async (req,res,next)=>{
    const {customer_id,delivery_date, total_cost} = req.params
    try{
        const order = await createOrder(customer_id,delivery_date, total_cost);
        console.log(order,"ORDER")
        res.send(order)
    }catch(error){
        next( error)
    }
})


//api/orders/customer_id
ordersRouter.get("/:customer_id", async(req,res,next) => {
        try{
            const id = req.params.customer_id;
            const orderId = await getOrderByCustomerId(id);
            console.log(orderId, "ORDER IDDDDDD")

        //    const orders = orderId.map(async(order) => {
        //     console.log(order,"OUR MAPPING ELEMENT ORDER")
        //     await attachOrderProductsToOrder(order);
        //     console.log(orders, "This is orders")
        //     })

            // const orders = orderId.filter((order) => order.order_id === orderId);
            // orderToReturn.products = orderProductsToAdd;
            // return orderToReturn;
           

            // res.send(orders)
        }catch(error) {
            next(error)
        }
    })





    






module.exports = ordersRouter;