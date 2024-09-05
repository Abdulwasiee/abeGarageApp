import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditService.module.css";
import { useParams, useNavigate } from "react-router-dom";

const EditService = () => {
  const { service_id } = useParams(); // Fetch the service_id from the URL params
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    service_name: "",
    service_description: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      console.log("Fetching service data for ID:", service_id);
      try {
        const response = await axios.get(
          `http://localhost:2030/api/services/${service_id}`
        );
        console.log("Service data received:", response.data.service);
        setServiceData(response.data.service);
      } catch (error) {
        console.error(
          "Error fetching service:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchService();
  }, [service_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Submitting updated service data for ID:",
      service_id,
      serviceData
    );
    try {
      await axios.put(
        `http://localhost:2030/api/services/${service_id}`,
        serviceData
      );
      console.log("Service updated successfully!");
      navigate("/admin/services"); // Redirect to the services list page after successful update
    } catch (error) {
      console.error(
        "Error updating service:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        Edit Service <span className={styles.titleUnderline}></span>
      </h2>
      <form onSubmit={handleSubmit} className={styles.serviceForm}>
        <div className={styles.formGroup}>
          <label htmlFor="service_name">Service Name</label>
          <input
            type="text"
            id="service_name"
            name="service_name"
            value={serviceData.service_name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="service_description">Service Description</label>
          <textarea
            id="service_description"
            name="service_description"
            value={serviceData.service_description}
            onChange={handleInputChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Update Service
        </button>
      </form>
    </div>
  );
};

export default EditService;
