const express = require("express");
const router = express.Router();

// Import the customer controller
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
} = require("../controller/customerController");

// Route to get all customers
router.get("/api/customers", getAllCustomers);

// Route to get a single customer by ID
router.get("/api/customers/:customer_id", getCustomerById);
// Route to delete a customer by ID
router.delete("/api/customers/:customer_id", deleteCustomerById);
// Route to add a new customer
router.post("/api/customers", createCustomer); // Notice no trailing slash here

// Route to update an existing customer by ID
router.put("/api/customers/:customer_id", updateCustomerById);

// Export the router
module.exports = router;
