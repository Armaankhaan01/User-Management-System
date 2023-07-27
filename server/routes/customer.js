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
router.get("/view/:id", mainController.view);
router.get("/edit/:id", mainController.edit);
router.put("/edit/:id", mainController.editPost);
router.delete("/edit/:id", mainController.deleteCustomer);
router.post('/search', mainController.search)


module.exports = router;