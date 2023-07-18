require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const { flash } = require("express-flash-message");
const methodOverride = require("method-override");
const session = require("express-session");
const osu = require("node-os-utils");
const SpeedTest = require("fast-speedtest-api");

// Perform the network speed test
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

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

//template engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routes
app.use("/", require("./server/routes/customer"));

/**
 * Get Server Ram Usage Pie Chart
 * I am trying something out to learn pie chart
 */

const useData = async (externalArray) => {
  const addDataToArray = async () => {
    externalArray.length = 0; // Clear the external array before adding new data
    let mem = osu.mem;

    const memory = mem.info().then((info) => {
      return info;
    });
    let usedMemory = (await memory).usedMemMb; // Wait for the promise to resolve and get the data
    externalArray.push(usedMemory);
    let freeMemory = (await memory).freeMemMb; // Wait for the promise to resolve and get the data
    externalArray.push(freeMemory);
    // console.log(freeMemory, usedMemory); // Access the resolved data
  };
  addDataToArray();
  setInterval(addDataToArray, 2000); // Automatically add data to the array in every 2 seconds
};

const ramArray = [];
const dataHandler = useData(ramArray);

app.get("/chart", async (req, res) => {
  const locals = {
    title: "Server Ram Usage",
    description: "This is a NodeJs Powered user management system",
  };
  try {
    res.render("pieChart", {
      locals,
      ramArray,
    });
  } catch (error) {
    console.log("Error fetching network speed:", error);
    res.send(error);
  }
});

app.get("/get-updated-data", async (req, res) => {
  res.json({ data: ramArray });
});

app.get("/networkSpeed", async (req, res) => {
  try {
    const speedTest = new SpeedTest({
      token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
    });
    const speed = await speedTest.getSpeed();

    // Convert speed to Mbps
    const speedMbps = ((speed / 1024 / 1024) * 8).toFixed(2);
    // Set caching headers
    const cacheDuration = 2; // Cache duration in seconds
    const cacheControlHeader = `public, max-age=${cacheDuration}`;
    res.setHeader("Cache-Control", cacheControlHeader);
    res.json({ speed: speedMbps });
  } catch (error) {
    console.log("Error fetching network speed:", error);
    res.send("error");
  }
});

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

// server configuration
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
