import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ServiceSection.module.css";

const ServiceSection = ({ onDataUpdate }) => {
  const { vehicle_id } = useParams();
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2030/api/vehicles/${vehicle_id}`
        );
        setVehicleInfo(response.data.vehicle);
        const customerId = response.data.vehicle.customer_id;

        // Update parent component with customerId and vehicleId
        onDataUpdate(customerId, vehicle_id);
      } catch (error) {
        setError("Failed to load vehicle and customer data");
      } finally {
        setLoading(false);
      }
    };

    if (vehicle_id) {
      fetchVehicleData();
    } else {
      setError("No vehicle ID provided in URL");
      setLoading(false);
    }
  }, [vehicle_id, onDataUpdate]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!vehicleInfo) {
    return <p>No data available</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.customerInfo}>
          <div className={styles.customerDetails}>
            <h3 className={styles.customerName}>
              {vehicleInfo.customer_first_name} {vehicleInfo.customer_last_name}
            </h3>
            <p className={styles.detail}>
              <b>Email:</b> {vehicleInfo.customer_email}
            </p>
            <p className={styles.detail}>
              <b>Phone Number:</b> {vehicleInfo.customer_phone_number}
            </p>
            <p className={styles.detail}>
              <b>Active Customer:</b>{" "}
              {vehicleInfo.customer_active_status === 1 ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleDetails}>
            <h3 className={styles.vehicleName}>
              {vehicleInfo.vehicle_make} {vehicleInfo.vehicle_model}
            </h3>
            <p className={styles.detail}>
              <b>Vehicle color:</b> {vehicleInfo.vehicle_color}
            </p>
            <p className={styles.detail}>
              <b>Vehicle tag:</b> {vehicleInfo.vehicle_tag}
            </p>
            <p className={styles.detail}>
              <b>Vehicle year:</b> {vehicleInfo.vehicle_year}
            </p>
            <p className={styles.detail}>
              <b>Vehicle mileage:</b> {vehicleInfo.vehicle_mileage}
            </p>
            <p className={styles.detail}>
              <b>Vehicle serial:</b> {vehicleInfo.vehicle_serial}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
