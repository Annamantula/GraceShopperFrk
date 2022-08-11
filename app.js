require("dotenv").config()
const express = require("express")
const cors = require("cors");
const app = express();
const router = require("./api");

app.use(cors());

app.use((req, res, next) => {
    console.log("App is up");
    next();
});
