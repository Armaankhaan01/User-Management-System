const Customer = require("../models/Customer");
const mongoose = require("mongoose");
/**
 * GET/
 * Home page
 */
exports.homepage = async (req, res) => {
  const message = await req.consumeFlash("info");
  const locals = {
    title: "Homepage",
    description: "This is a NodeJs Powered user managment system",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const customer = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Customer.count();
    res.render("index", {
      locals,
      message,
      customer,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET/
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add Customer",
    description: "This is a NodeJs Powered user managment system",
  };

  res.render("customer/addCustomer", locals);
};
/**
 * GET/
 * New Customer Form
 */
exports.addCustomerPost = async (req, res) => {
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    detail: req.body.detail,
  });
  const locals = {
    title: "Customer Added Success",
    description: "This is a NodeJs Powered user managment system",
  };

  try {
    await Customer.create(newCustomer);
    await req.flash("info", "New Customer has been added Successfully.");

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET/
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "This is a NodeJs Powered user managment system",
  };
  res.render("about", locals);
};
