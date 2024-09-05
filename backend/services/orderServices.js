const db = require("../config/database");

// Create an order
const createOrder = async (orderData) => {
  console.log("Creating order with data:", orderData); // Log orderData
  const { employee_id, customer_id, vehicle_id, order_hash } = orderData;

  const query = `INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
                 VALUES (?, ?, ?, 1, ?)`;

  const [result] = await db.query(query, [
    employee_id,
    customer_id,
    vehicle_id,
    order_hash,
  ]);

  console.log("Order created with ID:", result.insertId); // Log the created order ID
  return result.insertId;
};

// Create order info
const createOrderInfo = async (orderInfoData) => {
  console.log("Creating order info with data:", orderInfoData); // Log orderInfoData
  const {
    order_id,
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    received_by,
  } = orderInfoData;

  const query = `INSERT INTO order_info (order_id, order_total_price, additional_request, notes_for_internal_use, notes_for_customer, estimated_completion_date, received_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  await db.query(query, [
    order_id,
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    received_by,
  ]);

  console.log("Order info created for order ID:", order_id); // Log the order ID for which info was created
};

// Create order status
const createOrderStatus = async (order_id, order_status) => {
  console.log(
    "Creating order status for order ID:",
    order_id,
    "Status:",
    order_status
  ); // Log order_id and order_status
  const query = `INSERT INTO order_status (order_id, order_status)
                 VALUES (?, ?)`;

  await db.query(query, [order_id, order_status]);
  console.log("Order status created for order ID:", order_id); // Log the order ID for which status was created
};

// Link services to the order, with the default service status as 'Received'
const createOrderServices = async (order_id, service_ids) => {
  console.log(
    "Linking services to order ID:",
    order_id,
    "Services:",
    service_ids
  ); // Log order_id and service_ids
  for (const service_id of service_ids) {
    const query = `INSERT INTO order_services (order_id, service_id, service_completed)
                   VALUES (?, ?, 'Received')`; // Default status is now 'Received'
    await db.query(query, [order_id, service_id]);
  }

  console.log("Services linked to order ID:", order_id); // Log the order ID for which services were linked
};

// Get all orders
const getOrders = async () => {
  console.log("Fetching all orders from the database..."); // Log when fetching begins
  const query = `
    SELECT o.order_id, o.order_hash, o.active_order, oi.order_total_price, 
           oi.estimated_completion_date, oi.received_by, os.order_status, 
           ci_info.customer_first_name, ci_info.customer_last_name, 
           ci.customer_email, ci.customer_phone_number, 
           cvi.vehicle_model, cvi.vehicle_tag, cvi.vehicle_year, 
           o.order_date
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status os ON o.order_id = os.order_id
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
  `;

  const [orders] = await db.query(query);
  console.log("Fetched orders:", orders); // Log the fetched orders
  return orders;
};

const updateOrder = async (orderId, orderData) => {
  const {
    order_total_price,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    estimated_completion_date,
    completion_date,
    order_status,
    services, // This should now be an array of services
  } = orderData;

  await db.query("START TRANSACTION");

  try {
    // Update order_info
    const updateOrderInfoQuery = `
      UPDATE order_info
      SET order_total_price = ?, additional_request = ?, notes_for_internal_use = ?,
          notes_for_customer = ?, estimated_completion_date = ?, completion_date = ?
      WHERE order_id = ?
    `;
    await db.query(updateOrderInfoQuery, [
      order_total_price,
      additional_request,
      notes_for_internal_use,
      notes_for_customer,
      estimated_completion_date,
      completion_date,
      orderId,
    ]);

    // Update order_status
    const updateOrderStatusQuery = `
      UPDATE order_status
      SET order_status = ?
      WHERE order_id = ?
    `;
    await db.query(updateOrderStatusQuery, [order_status, orderId]);

    // Update services in order_services
    for (const service of services) {
      const updateOrderServicesQuery = `
        UPDATE order_services
        SET service_completed = ?
        WHERE order_id = ? AND service_id = ?
      `;
      await db.query(updateOrderServicesQuery, [
        service.service_completed, // The updated status
        orderId,
        service.service_id, // Ensure the correct service is being updated
      ]);
    }

    await db.query("COMMIT");
  } catch (error) {
    console.error("Error during order update, rolling back:", error.message);
    await db.query("ROLLBACK");
    throw error;
  }
};


// Get order details
const getOrderDetails = async (orderId) => {
  const query = `
    SELECT 
      o.order_id, 
      o.order_hash, 
      o.active_order, 
      oi.order_total_price, 
      oi.additional_request, 
      oi.notes_for_internal_use, 
      oi.notes_for_customer, 
      oi.estimated_completion_date, 
      oi.completion_date, 
      ord_status.order_status, 
      ci_info.customer_first_name, 
      ci_info.customer_last_name,
      ci.customer_email, 
      ci.customer_phone_number,
      cvi.vehicle_model, 
      cvi.vehicle_tag, 
      cvi.vehicle_year, 
      cvi.vehicle_mileage,
      s.service_id, 
      s.service_name, 
      ord_serv.service_completed
    FROM orders o
    JOIN order_info oi ON o.order_id = oi.order_id
    JOIN order_status ord_status ON o.order_id = ord_status.order_id  -- Unique alias for order_status
    JOIN customer_info ci_info ON o.customer_id = ci_info.customer_id
    JOIN customer_identifier ci ON o.customer_id = ci.customer_id
    JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    JOIN order_services ord_serv ON o.order_id = ord_serv.order_id  -- Unique alias for order_services
    JOIN common_services s ON ord_serv.service_id = s.service_id
    WHERE o.order_id = ?
  `;

  const [orderDetails] = await db.query(query, [orderId]);

  if (orderDetails.length === 0) {
    throw new Error("Order not found");
  }

  return {
    ...orderDetails[0],
    services: orderDetails.map((service) => ({
      service_id: service.service_id,
      service_name: service.service_name,
      service_completed: service.service_completed, // This will be the string value
    })),
  };
};

// Delete an order by order ID
const deleteOrder = async (order_id) => {
  console.log("Deleting order with ID:", order_id); // Log the order ID

  await db.query("START TRANSACTION"); // Start a transaction to ensure atomicity

  try {
    // Delete from order_services
    const deleteOrderServicesQuery = `DELETE FROM order_services WHERE order_id = ?`;
    await db.query(deleteOrderServicesQuery, [order_id]);

    // Delete from order_status
    const deleteOrderStatusQuery = `DELETE FROM order_status WHERE order_id = ?`;
    await db.query(deleteOrderStatusQuery, [order_id]);

    // Delete from order_info
    const deleteOrderInfoQuery = `DELETE FROM order_info WHERE order_id = ?`;
    await db.query(deleteOrderInfoQuery, [order_id]);

    // Delete from orders
    const deleteOrderQuery = `DELETE FROM orders WHERE order_id = ?`;
    await db.query(deleteOrderQuery, [order_id]);

    await db.query("COMMIT"); // Commit the transaction
    console.log("Order deleted successfully with ID:", order_id); // Log the success
  } catch (error) {
    await db.query("ROLLBACK"); // Roll back the transaction in case of an error
    console.error("Error deleting order with ID:", order_id, error.message); // Log the error
    throw error;
  }
};

module.exports = {
  createOrder,
  createOrderInfo,
  createOrderServices,
  createOrderStatus,
  getOrders,
  updateOrder,
  getOrderDetails,
  deleteOrder,
};
