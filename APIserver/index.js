const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.listen(3000, console.log("サーバー起動"))

app.get("/", (req, res) => {
    res.send("プログラミング");
});

const products = require("./data.json");

app.get("/api/products", (req, res) => {
    res.send(products);
});