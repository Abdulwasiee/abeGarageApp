import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditOrder.module.css"; // Assuming you have this file for styles

const EditOrder = () => {
  const { orderId } = useParams(); // Get the orderId from the URL
  const navigate = useNavigate(); // To navigate back after a successful edit

  const [orderData, setOrderData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_email: "",
    customer_phone_number: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_tag: "",
    order_total_price: "",
    order_status: "Vehicle Dropped Off", // Default value for the whole order
    additional_request: "",
    estimated_completion_date: "",
    completion_date: "",
    notes_for_internal_use: "",
    notes_for_customer: "",
    services: [], // Holds the services and their statuses
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Single error state

  useEffect(() => {
    // Fetch the order data, including service statuses
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/orders/${orderId}`
        );
        const {data} = response;
        setOrderData({
          ...data,
          ...response.data,
          services: response.data.services, // Include services in the state
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
    setError(""); // Clear error when the user starts typing
  };
const handleServiceStatusChange = (e, index) => {
  const updatedServices = [...orderData.services]; // Create a copy of the services array
  updatedServices[index].service_completed = e.target.value; // Update the selected service status
  console.log("Updated service:", updatedServices[index]); // Log the updated service
  setOrderData({ ...orderData, services: updatedServices }); // Set the updated services array in the state
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // Prepare the data to send to the backend, explicitly removing top-level service_id, service_name, and service_completed
    const { service_id, service_name, service_completed, ...cleanOrderData } =
      orderData;

    const updatedOrderData = {
      ...cleanOrderData, // Spread the cleaned order data
      services: orderData.services.map((service) => ({
        service_id: service.service_id,
        service_name: service.service_name,
        service_completed: service.service_completed,
      })),
    };

    console.log("Submitting order with data:", updatedOrderData); // Log the data being sent

    // Send the updated data to the backend
    await axios.put(
      `http://localhost:2030/api/orders/${orderId}`,
      updatedOrderData
    );

    alert("Order updated successfully!");
    navigate("/admin/orders"); // Redirect after success
  } catch (error) {
    console.error(
      "Error updating order:",
      error.response?.data?.error || error.message
    );
    setError(error.response?.data?.error || "Estimated Date and Completion Date Are Required.");
  }
};

  return (
    <div className={styles.editOrderContainer}>
      <h2 className={styles.sectionTitle}>
        Edit Order <span className={styles.titleUnderline}></span>
      </h2>

      {loading ? (
        <p>Loading order details...</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.editOrderForm}>
          {/* Customer Information (Non-editable) */}
          <div className={styles.formGroup}>
            <label>Customer Name</label>
            <input
              type="text"
              name="customer_first_name"
              value={orderData.customer_first_name}
              readOnly
              className={styles.input}
            />
            <input
              type="text"
              name="customer_last_name"
              value={orderData.customer_last_name}
              readOnly
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="customer_email"
              value={orderData.customer_email}
              readOnly
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="text"
              name="customer_phone_number"
              value={orderData.customer_phone_number}
              readOnly
              className={styles.input}
            />
          </div>

          {/* Vehicle Information (Non-editable) */}
          <div className={styles.formGroup}>
            <label>Vehicle Details</label>
            <input
              type="text"
              name="vehicle_model"
              value={orderData.vehicle_model}
              readOnly
              className={styles.input}
            />
            <input
              type="text"
              name="vehicle_year"
              value={orderData.vehicle_year}
              readOnly
              className={styles.input}
            />
            <input
              type="text"
              name="vehicle_tag"
              value={orderData.vehicle_tag}
              readOnly
              className={styles.input}
            />
          </div>

          {/* Editable Fields */}
          <div className={styles.formGroup}>
            <label>Total Price</label>
            <input
              type="number"
              name="order_total_price"
              value={orderData.order_total_price}
              onChange={handleChange}
              placeholder="Order Total Price"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Order Status</label>
            <select
              name="order_status"
              value={orderData.order_status}
              onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="Vehicle Dropped Off">Vehicle Dropped Off</option>
              <option value="Inspection in Progress">
                Inspection in Progress
              </option>
              <option value="Parts Ordered">Parts Ordered</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Repair in Progress">Repair in Progress</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Order Cancelled">Order Cancelled</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Estimated Completion Date</label>
            <input
              type="datetime-local"
              name="estimated_completion_date"
              value={orderData.estimated_completion_date || ""}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="completion_date">Completion Date</label>
            <input
              type="datetime-local"
              name="completion_date"
              value={orderData.completion_date || ""}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes_for_internal_use">
              Notes for Internal Use
            </label>
            <textarea
              id="notes_for_internal_use"
              value={orderData.notes_for_internal_use}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter notes for internal use"
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes_for_customer">Notes for Customer</label>
            <textarea
              id="notes_for_customer"
              value={orderData.notes_for_customer}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter notes for the customer"
            ></textarea>
          </div>

          {/* Service Status Dropdowns with Service Names */}
          {orderData.services.map((service, index) => (
            <div key={service.service_id} className={styles.formGroup}>
              <label>{service.service_name} Status</label> {/* Service Name */}
              <select
                name={`service_status_${service.service_id}`}
                value={service.service_completed}
                onChange={(e) => handleServiceStatusChange(e, index)}
                className={styles.selectInput}
              >
                <option value="Received">Received</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Order Cancelled">Order Cancelled</option>
                <option value="Parts Ordered">Parts Ordered</option>
                <option value="Waiting for Parts">Waiting for Parts</option>
                <option value="Repair in Progress">Repair in Progress</option>
              </select>
            </div>
          ))}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditOrder;
