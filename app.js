require("dotenv").config()
const express = require("express")
const cors = require("cors");
const app = express();
const router = require("./api");

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log("App is up");
    next();
});
app.get('/', (req, res, next) => {
    res.json({msg:"API Working"});
})



app.use('/api', router);

app.get('*', (req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });
  app.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if(res.statusCode < 400) {res.status(500)}
    res.send({error: error.error, name: error.name, message: error.message});
  });
  
  
  module.exports = app;