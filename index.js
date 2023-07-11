require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const { flash } = require("express-flash-message");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static Files
app.use("/public", express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Flash Messages
app.use(flash({sessionKeyName:'flashMessage'}));

//Connect to database
connectDB();

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routes
app.use("/", require("./server/routes/customer"));

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

// server configuration
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
