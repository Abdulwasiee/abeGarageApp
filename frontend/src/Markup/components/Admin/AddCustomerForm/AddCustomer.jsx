import React, { useState } from "react";
import styles from "./AddCustomer.module.css";
import { useNavigate } from "react-router-dom";

function AddCustomer() {
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();

  // State for form fields
  const [customerForm, setCustomerForm] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    customer_email: "",
    customer_active_status: 1, // Default value set to 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const apiUrl = "http://localhost:2030/api/customers/";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerForm),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message);
        setCustomerForm({
          customer_first_name: "",
          customer_last_name: "",
          customer_phone_number: "",
          customer_email: "",
          customer_active_status: 1, // Reset to default value
        });
        navigate("/admin/customers");
      } else {
        setResponseMessage(result.error || "An unexpected error occurred.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  const validateFields = () => {
    const {
      customer_first_name,
      customer_last_name,
      customer_phone_number,
      customer_email,
    } = customerForm;
    if (
      !customer_first_name ||
      !customer_last_name ||
      !customer_phone_number ||
      !customer_email
    ) {
      setResponseMessage("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Add a new customer</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.responseMessage}>
            {responseMessage && <h3>{responseMessage}</h3>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_first_name" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="customer_first_name"
              name="customer_first_name"
              value={customerForm.customer_first_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer First Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_last_name" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="customer_last_name"
              name="customer_last_name"
              value={customerForm.customer_last_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Last Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_phone_number" className={styles.label}>
              Phone Number
            </label>
            <input
              type="text"
              id="customer_phone_number"
              name="customer_phone_number"
              value={customerForm.customer_phone_number}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Phone Number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="customer_email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={customerForm.customer_email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Customer Email"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
