require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const { flash } = require("express-flash-message");
const { createCanvas, registerFont } = require("canvas");
const Chart = require("chart.js");
const session = require("express-session");
const osu = require("node-os-utils");
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
app.use(flash({ sessionKeyName: "flashMessage" }));

//Connect to database
connectDB();

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routes
app.use("/", require("./server/routes/customer"));


/**
 * Get Server Ram Usage Pie Chart
 * I am trying something out to learn piechart 
 */

const useData = async (externalArray) => {
  const addDataToArray = async () => {
    externalArray.length = 0; // Clear the external array before adding new data
    let mem = osu.mem;

    const memory = mem.info().then((info) => {
      return info;
    });
    let freeMemory = (await memory).freeMemMb; // Wait for the promise to resolve and get the data
    let usedMemory = (await memory).usedMemMb; // Wait for the promise to resolve and get the data
    externalArray.push(freeMemory);
    externalArray.push(usedMemory);
    console.log(freeMemory, usedMemory); // Access the resolved data
  };
  addDataToArray();
  setInterval(addDataToArray, 2000); // Automatically add data to the array in every 5 seconds
};

const myArray = [];
const dataHandler = useData(myArray);

app.get("/chart", (req, res) => {
  const canvasWidth = 400; // Width of the canvas
  const canvasHeight = 400; // Height of the canvas
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  console.log(myArray);
  const data = {
    labels: ["Used Ram", "Free Ram"],
    values: myArray,
  };

  const chartConfig = {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: ["red", "blue"], // Customize colors as needed
        },
      ],
    },
    options: {
      responsive: true, // Adjust as per your requirements
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom", // Change position if needed
        },
      },
    },

  };
  const locals = {
    title: "Server Ram Usage",
    description: "This is a NodeJs Powered user managment system",
  };
  const chart = new Chart(ctx, chartConfig);

  const imageURI = canvas.toDataURL("image/png");
  res.render("pieChart", { locals, imageURI });
});

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

// server configuration
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
