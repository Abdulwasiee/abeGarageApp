import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import styles from "./CustomerProfile.module.css";
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import VehicleSection from "../../../components/Admin/VehicleSection/VehicleSection"; // Import the new VehicleSection component
import CustomerOrders from "../../../components/Admin/CustomerOrders/CustomerOrders";

const CustomerProfile = () => {
  const { customer_id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/customers/${customer_id}`
        );
        setCustomer(response.data.customer);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/customers/${customer_id}/vehicles`
        );
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchCustomerData();
    fetchVehicles();
  }, [customer_id]);

  const handleEdit = () => {
    navigate(`/customers/edit-customer/${customer_id}`);
  };

  if (!customer) {
    return <p>Loading customer data...</p>;
  }

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>
          Customer: {customer.customer_first_name} {customer.customer_last_name}
        </h2>
        <div className={styles.innerWrapperContainer}>
          <p className={styles.profileDetails}>
            <b className={styles.detailLabel}>Email:</b>{" "}
            {customer.customer_email}
          </p>
          <p className={styles.profileDetails}>
            <b className={styles.detailLabel}>Phone Number:</b>{" "}
            {customer.customer_phone_number}
          </p>
          <p className={styles.profileDetails}>
            <b className={styles.detailLabel}>Active Customer:</b>{" "}
            {customer.customer_active_status === 1 ? "Yes" : "No"}
          </p>
        </div>
        <div className={styles.innerWrapperContainer1}>
          <p>Edit customer info</p>
          <div className={styles.editButton1} onClick={handleEdit}>
            <FaEdit />
          </div>
        </div>

        <VehicleSection
          customer_first_name={customer.customer_first_name}
          customer_id={customer_id}
          vehicles={vehicles}
          setVehicles={setVehicles}
        />

       <CustomerOrders customer_first_name={customer.customer_first_name} />
      </div>
    </div>
  );
};

export default CustomerProfile;
