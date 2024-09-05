import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa"; // Import FaTimes icon for the 'X' button
import styles from "./ChooseVehicle.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import VehicleList from "../VehicleList/VehicleList";

const ChooseVehicle = () => {
  const { customer_id } = useParams(); // Notice that vehicle_id is not used here
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShrinking, setIsShrinking] = useState(false); // Track the shrinking animation state

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/customers/${customer_id}`
        );
        setCustomer(response.data.customer);
      } catch (error) {
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/customers/${customer_id}/vehicles`
        );
        setVehicles(response.data.vehicles);
      } catch (error) {
        setError("This User Doesn't have Vehicles Yet");
        setTimeout(() => {
          navigate("/admin/add-order"); // Redirect to the Add Order page
        }, 1500);
      }
    };

    fetchCustomerData();
    fetchVehicles();
  }, [customer_id]);

  const handleEdit = () => {
    navigate(`/customers/edit-customer/${customer_id}`);
  };

  const handleClose = () => {
    setIsShrinking(true); // Trigger the shrinking animation
    setTimeout(() => {
      navigate("/admin/add-order"); // Redirect after 1 second
    });
  };

  const handleVehicleSelect = (vehicle_id) => {
    
    navigate(`/vehicles/${vehicle_id}`);
  };

  if (loading) {
    return <p>Loading customer data...</p>;
  }

 if (error) {
   return <p className={styles.errorMessage}>{error}</p>; // Apply the error message styling here
 }

  return (
    <div className={`${styles.container} ${isShrinking ? styles.shrink : ""}`}>
      <SideBar />
      <div className={styles.profileContainer}>
        <div className={styles.titlediv}>
          <h2 className={styles.title}>Create a new order</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        <div className={styles.customerInfo}>
          <div className={styles.customerDetails}>
            <h3 className={styles.customerName}>
              {customer.customer_first_name} {customer.customer_last_name}
            </h3>
            <p className={styles.detail}>
              <b>Email:</b> {customer.customer_email}
            </p>
            <p className={styles.detail}>
              <b>Phone Number:</b> {customer.customer_phone_number}
            </p>
            <p className={styles.detail}>
              <b>Active Customer:</b>{" "}
              {customer.customer_active_status === 1 ? "Yes" : "No"}
            </p>
            <div className={styles.editContainer} onClick={handleEdit}>
              <FaEdit className={styles.editIcon} />
              <span>Edit customer info</span>
            </div>
          </div>
          <FaTimes className={styles.removeIcon} onClick={handleClose} />
        </div>

        <VehicleList
          customer_first_name={customer.customer_first_name}
          vehicles={vehicles}
          handleVehicleSelect={handleVehicleSelect} // Pass the function directly
        />
      </div>
    </div>
  );
};

export default ChooseVehicle;
