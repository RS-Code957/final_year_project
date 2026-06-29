const express = require("express");
const app = express();
require("dotenv").config();
require("./connections/conn");
const user = require("./routes/user");
const Book = require("./routes/book");
const favourites = require("./routes/favourits");
const cart = require("./routes/cart");
const order = require("./routes/order")
//  example
// app.get("/", (req,res) =>{
//     res.send("hello from backend side")
// })

// routes
app.use(express.json());
app.use("/api/v1",user);
app.use("/api/v1",Book);
app.use("/api/v1",favourites);
app.use("/api/v1",cart);
app.use("/api/v1",order);

// creating port
app.listen(process.env.PORT, () => {
    console.log(`server started AT PORT  ${process.env.PORT}`);
});