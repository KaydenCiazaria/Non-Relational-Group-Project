const express = require("express");
const sampleController = require("../controllers/sampleController");

const router = express.Router();

router.route('/route-name') // YOU CAN CUSTOMIZE YOUR ROUTE NAME, JUST CHANGE 'route-name' INTO ANYTHING YOU LIKE
    .post(sampleController.function_name) // GET, POST, UPDATE, DELETE, etc.
    
module.exports = router;