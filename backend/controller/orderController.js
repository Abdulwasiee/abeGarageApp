const {
  createOrder,
  createOrderInfo,
  createOrderServices,
  createOrderStatus,
  getOrders,
  updateOrder,
  getOrderDetails,
  deleteOrder, // Import deleteOrder
} = require("../services/orderServices");

const createNewOrder = async (req, res) => {
  console.log("Incoming order creation request:", req.body); // Log the incoming request data

  const {
    employee_id,
    customer_id,
    vehicle_id,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    service_ids,
    order_total_price,
    estimated_completion_date,
    received_by,
    order_status,
  } = req.body;

  try {
    const order_hash = require("crypto").randomBytes(16).toString("hex");
    const order_id = await createOrder({
      employee_id,
      customer_id,
      vehicle_id,
      order_hash,
    });

    await createOrderInfo({
      order_id,
      order_total_price,
      additional_request,
      notes_for_internal_use,
      notes_for_customer,
      estimated_completion_date,
      received_by,
    });

    await createOrderStatus(order_id, order_status);

    await createOrderServices(order_id, service_ids);

    console.log("Order created successfully with ID:", order_id); // Log success
    res.status(201).json({ message: "Order created successfully", order_id });
  } catch (error) {
    console.error("Error creating order:", error.message); // Log the error
    res.status(500).json({ error: "Failed to create order" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await getOrders();
    console.log("Listing all orders"); // Log when listing orders
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message); // Log the error
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const editOrder = async (req, res) => {
  const { orderId } = req.params;
  const {
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    completion_date,
    order_status,
    service_ids,
  } = req.body;

  // Backend validation
  if (!order_total_price || isNaN(order_total_price)) {
    return res
      .status(400)
      .json({ error: "Order total price must be a valid number." });
  }
  if (!estimated_completion_date) {
    return res
      .status(400)
      .json({ error: "Estimated completion date is required." });
  }

  if (!order_status) {
    return res.status(400).json({ error: "Order status is required." });
  }


  try {
    console.log("Editing order ID:", orderId, "with data:", req.body);
    await updateOrder(orderId, req.body);
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error during order update:", error.message);
    res
      .status(500)
      .json({ error: "Estimated Date and Completion Date Are Required." });
  }
};


const getOrderDetail = async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log("Fetching details for order ID:", orderId); // Log the order ID being fetched
    const orderDetail = await getOrderDetails(orderId);
    res.status(200).json(orderDetail);
  } catch (error) {
    console.error("Error fetching order details:", error.message); // Log the error
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

// New deleteOrder function
const removeOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    console.log("Deleting order ID:", orderId); // Log the order being deleted
    await deleteOrder(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message); // Log the error
    res.status(500).json({ error: "Failed to delete order" });
  }
};

module.exports = {
  createNewOrder,
  listOrders,
  editOrder,
  getOrderDetail,
  removeOrder, // Export the removeOrder function
};
