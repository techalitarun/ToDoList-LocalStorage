const express = require("express");
const bodyParser = require("body-parser");
const { LocalStorage } = require("node-localstorage");
const ld = require("lodash");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const localStorage = new LocalStorage(path.join(__dirname, "local-storage")); // Adjust the path to your desired local storage directory
var items = [];
var workItems = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  const today = "Today"; // You can replace this with dynamic date handling if needed

  let newListTasks = JSON.parse(localStorage.getItem(today));
  if (!newListTasks) {
    newListTasks = [];
  }

  res.render("list", { listTitle: today, newListTasks });
});

app.post("/", function (req, res) {
  const newItem = {
    _id: Date.now().toString(),
    name: req.body.newtask,
  };

  const today = "Today"; // You can replace this with dynamic date handling if needed

  let newListTasks = JSON.parse(localStorage.getItem(today));
  if (!newListTasks) {
    newListTasks = [];
  }
  newListTasks.push(newItem);

  localStorage.setItem(today, JSON.stringify(newListTasks));

  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const deleteItemId = req.body.deleteitem;
  const listName = req.body.listName;

  let listItems = JSON.parse(localStorage.getItem(listName));
  if (!listItems) {
    listItems = [];
  }

  const updatedItems = listItems.filter((item) => item._id !== deleteItemId);

  localStorage.setItem(listName, JSON.stringify(updatedItems));

  res.redirect("/");
});

app.get("/:topic", function (req, res) {
  const customListName = ld.capitalize(req.params.topic);

  let newListTasks = JSON.parse(localStorage.getItem(customListName));
  if (!newListTasks) {
    newListTasks = [];
  }

  res.render("list", { listTitle: customListName, newListTasks });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000");
});