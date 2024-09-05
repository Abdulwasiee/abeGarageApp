const customerService = require("../services/customerServices");

async function createCustomer(req, res) {
  console.log("Received a request to create a customer");
  console.log("Request body:", req.body);

  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    
  } = req.body;

  // Validate required fields
  if (
    !customer_email ||
    !customer_phone_number ||
    !customer_first_name ||
    !customer_last_name
  ) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const customerExists = await customerService.getCustomerByEmail(
      customer_email
    );
    console.log("Customer exists:", customerExists);

    if (customerExists) {
      console.error("Customer already exists");
      return res
        .status(400)
        .json({ error: "Customer with this email already exists!" });
    }

    const newCustomer = await customerService.createCustomer({
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
    });

    console.log("Customer created successfully:", newCustomer);
    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error.message); // Log the specific error message
    res
      .status(500)
      .json({ error: error.message || "Failed to create customer" });
  }
}

// Get customer by ID
async function getCustomerById(req, res) {
  const customer_id = req.params.customer_id;

  try {
    const customer = await customerService.getCustomerById(customer_id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
}

// Get all customers
async function getAllCustomers(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  try {
    const customers = await customerService.getAllCustomers(offset, limit);
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
}

async function updateCustomerById(req, res) {
  const { customer_id } = req.params;
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    customer_active_status,
  } = req.body;

  // Backend validation
  if (
    !customer_email ||
    !customer_phone_number ||
    !customer_first_name ||
    !customer_last_name
  ) {
    return res.status(400).json({
      error: "All fields are required!",
    });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  try {
    const result = await customerService.updateCustomerById(customer_id, {
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      customer_active_status,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      status: "success",
      message: `${customer_first_name} information updated successfully`,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
}


// Delete customer by ID
async function deleteCustomerById(req, res) {
  const customer_id = req.params.customer_id;

  try {
    const deleted = await customerService.deleteCustomerById(customer_id);

    if (!deleted) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomerById,
  deleteCustomerById,
};
