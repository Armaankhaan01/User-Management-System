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

/**
 * GET/
 * View Customer Data
 */
exports.view = async (req, res) => {
  const option = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const message = await req.consumeFlash("info");
  try {
    const customer = await Customer.findById({ _id: req.params.id });
    const locals = {
      title: `View ${customer.firstName}`,
      description: "This is a NodeJs Powered user managment system",
    };
    res.render("view", { locals, customer, option, message });
  } catch (error) {
    console.error(error);
  }
};

/**
 * GET/
 * Edit Customer Data
 */

exports.edit = async (req, res) => {
  const option = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  try {
    const customer = await Customer.findById({ _id: req.params.id });
    const locals = {
      title: `Edit ${customer.firstName}`,
      description: "This is a NodeJs Powered user managment system",
    };
    console.log(customer);
    res.render("edit", { locals, customer, option });
  } catch (error) {
    console.error(error);
  }
};

/**
 * POST/
 * POST Edited Customer Data
 */

exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      detail: req.body.detail,
      updatedAt: Date.now(),
    });
    await req.flash("info", "Customer has been updated Successfully.");
    res.redirect(`/view/${req.params.id}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Delete/
 * Delete Customer Data
 */

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};
/**
 * get/
 * search Customer Data
 */

exports.search = async (req, res) => {
  const locals = {
    title: `Search Customer`,
    description: "This is a NodeJs Powered user managment system",
  };
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
    const searchResult = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    });
    console.log(searchResult);
res.render("search",{
  customers:searchResult,
  locals
})   
  } catch (error) {
    console.error(error);
  }
};
