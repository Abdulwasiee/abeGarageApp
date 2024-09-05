import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ChooseServices.module.css";
import { useUser } from "../../../../context/UserContext";

const ChooseServices = ({ customerId, vehicleId }) => {
  const { user } = useUser();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [notesForInternalUse, setNotesForInternalUse] = useState("");
  const [notesForCustomer, setNotesForCustomer] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("Vehicle Dropped Off"); // Default value
  const [error, setError] = useState(""); // Single error state

  const servicesPerPage = 7;

  useEffect(() => { 
    console.log("user:", user);
    console.log("customerId:", customerId, "vehicleId:", vehicleId);

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/services?page=${currentPage}&limit=${servicesPerPage}`
        );
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [currentPage, user, customerId, vehicleId]);

  const handleCheckboxChange = (service_id) => {
    if (selectedServices.includes(service_id)) {
      setSelectedServices(selectedServices.filter((id) => id !== service_id));
    } else {
      setSelectedServices([...selectedServices, service_id]);
    }
    setError(""); // Clear error when a service is selected
  };

  const handleOrderSubmit = async () => {
    // Validate form inputs in the order of importance
    if (selectedServices.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    if (!orderTotalPrice) {
      setError("Order total price is required.");
      return;
    }

    if (isNaN(orderTotalPrice)) {
      setError("Order total price must be a number.");
      return;
    }

    if (!estimatedCompletionDate) {
      setError("Estimated completion date is required.");
      return;
    }

    if (!additionalRequest.trim()) {
      setError("Additional request is required.");
      return;
    }

    if (!notesForInternalUse.trim()) {
      setError("Notes for internal use are required.");
      return;
    }

    if (!notesForCustomer.trim()) {
      setError("Notes for customer are required.");
      return;
    }

    // Clear any existing errors before submitting
    setError("");

    if (!user?.employee_id || !customerId || !vehicleId) {
      console.error("Missing required data:", {
        employee_id: user?.employee_id,
        customer_id: customerId,
        vehicle_id: vehicleId,
      });
      alert("Unable to create order. Missing required information.");
      return;
    }

    const orderData = {
      employee_id: user?.employee_id,
      customer_id: customerId,
      vehicle_id: vehicleId,
      service_ids: selectedServices,
      order_total_price: parseFloat(orderTotalPrice),
      additional_request: additionalRequest,
      notes_for_internal_use: notesForInternalUse,
      notes_for_customer: notesForCustomer,
      estimated_completion_date: estimatedCompletionDate,
      received_by: `${user?.employee_first_name} ${user?.employee_last_name}`,
      order_status: orderStatus, // Include order status in the form submission
    };

    console.log("Submitting order with data:", orderData);

    try {
      const response = await axios.post(
        "http://localhost:2030/api/orders",
        orderData
      );
      console.log("Order created successfully with response:", response.data);
      alert(`Order created successfully with ID: ${response.data.order_id}`);
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create order");
    }
  };

  return (
    <div className={styles.chooseServiceContainer}>
      <h2 className={styles.sectionTitle}>
        Choose Service <span className={styles.titleUnderline}></span>
      </h2>
      <p>
        Select the services you wish to include. You can search and select from
        the list below.
      </p>
      {services.map((service) => (
        <div key={service.service_id} className={styles.serviceItem}>
          <div className={styles.serviceInfo}>
            <h4 className={styles.serviceName}>{service.service_name}</h4>
            <p className={styles.serviceDescription}>
              {service.service_description}
            </p>
          </div>
          <input
            type="checkbox"
            className={styles.serviceCheckbox}
            checked={selectedServices.includes(service.service_id)}
            onChange={() => handleCheckboxChange(service.service_id)}
          />
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>{currentPage}</span>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={services.length < servicesPerPage}
        >
          Next
        </button>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="orderTotalPrice">Order Total Price:</label>
        <input
          type="number"
          id="orderTotalPrice"
          value={orderTotalPrice}
          onChange={(e) => {
            setOrderTotalPrice(e.target.value);
            setError(""); // Clear error when the user starts typing
          }}
          className={styles.input}
          placeholder="Enter total price"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="receivedBy">Received By:</label>
        <input
          type="text"
          id="receivedBy"
          value={`${user?.employee_first_name} ${user?.employee_last_name}`}
          readOnly
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="estimatedCompletionDate">
          Estimated Completion Date:
        </label>
        <input
          type="datetime-local"
          id="estimatedCompletionDate"
          value={estimatedCompletionDate}
          onChange={(e) => {
            setEstimatedCompletionDate(e.target.value);
            setError(""); // Clear error when the user starts typing
          }}
          className={styles.input}
        />
      </div>

      {/* Order Status dropdown */}
      <div className={styles.formGroup}>
        <label htmlFor="orderStatus">Order Status:</label>
        <select
          id="orderStatus"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className={styles.input}
        >
          <option value="Vehicle Dropped Off">Vehicle Dropped Off</option>
          <option value="Inspection in Progress">Inspection in Progress</option>
          <option value="Parts Ordered">Parts Ordered</option>
          <option value="Waiting for Parts">Waiting for Parts</option>
          <option value="Repair in Progress">Repair in Progress</option>
          <option value="Quality Check">Quality Check</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Customer Notified">Customer Notified</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Order Cancelled">Order Cancelled</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalRequest">Additional Request:</label>
        <textarea
          id="additionalRequest"
          value={additionalRequest}
          onChange={(e) => {
            setAdditionalRequest(e.target.value);
            setError(""); // Clear error when the user starts typing
          }}
          className={styles.textarea}
          placeholder="Enter any additional requests"
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="notesForInternalUse">Notes for Internal Use:</label>
        <textarea
          id="notesForInternalUse"
          value={notesForInternalUse}
          onChange={(e) => {
            setNotesForInternalUse(e.target.value);
            setError(""); // Clear error when the user starts typing
          }}
          className={styles.textarea}
          placeholder="Enter notes for internal use"
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="notesForCustomer">Notes for Customer:</label>
        <textarea
          id="notesForCustomer"
          value={notesForCustomer}
          onChange={(e) => {
            setNotesForCustomer(e.target.value);
            setError(""); // Clear error when the user starts typing
          }}
          className={styles.textarea}
          placeholder="Enter notes for the customer"
        ></textarea>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div>
        <button className={styles.submitButton} onClick={handleOrderSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default ChooseServices;
