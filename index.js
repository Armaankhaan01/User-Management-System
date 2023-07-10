require("dotenv");

const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static Files
app.use("/public", express.static("public"));

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routes
app.use("/", require("./server/routes/index"));

// server configuration
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
