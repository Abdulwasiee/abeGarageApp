import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // Import useUser to get the logged-in user data

const CreateOrder = ({ customer_id, vehicle_id, service_ids }) => {
  const { user } = useUser(); // Get the logged-in user's data
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    order_total_price: 0,
    additional_request: "",
    notes_for_internal_use: "",
    notes_for_customer: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const orderPayload = {
      employee_id: user.employee_id, // Dynamically use the employee_id from the logged-in user
      customer_id,
      vehicle_id,
      service_ids,
      ...orderData,
    };

    try {
      const response = await axios.post(
        "http://localhost:2030/api/orders",
        orderPayload
      );
      console.log("Order created successfully:", response.data);
      navigate("/admin/orders"); // Redirect after successful order creation
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form fields for additional_request, notes_for_internal_use, notes_for_customer, etc. */}
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default CreateOrder;
