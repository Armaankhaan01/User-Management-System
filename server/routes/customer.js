const express = require('express');
const router = express.Router();
const mainController = require('../controllers/customerController');

/**
 * customer Routes
 */


router.get("/", mainController.homepage);
router.get("/add", mainController.addCustomer);
router.post("/add", mainController.addCustomerPost);
router.get("/about", mainController.about);




module.exports = router;