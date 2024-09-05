import React, { useEffect, useState } from "react";
import styles from "./Services.module.css";
import { Link } from "react-router-dom";
import {
  FaPowerOff,
  FaCog,
  FaCar,
  FaTachometerAlt,
  FaPaintBrush,
} from "react-icons/fa";
import Loading from "../../../components/Loading/Loading";
import axios from "axios";

const Services = () => {
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [services, setServices] = useState([]); // State to store fetched services

  useEffect(() => {
    // Fetch services from the database
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:2030/api/services");
        setServices(response.data.services); // Assuming the API returns services as an array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <Loading />; // Display loading screen while data is being fetched
  }

  return (
    <div className={styles.topheader}>
      <div className={styles.services}>
        <div className={styles.heroSection}>
          <h1>Our Services</h1>
          <p>
            <Link to="/home">Home</Link> &gt;
            <Link to="/services">Services</Link>
          </p>
        </div>
      </div>
      <section className={styles.servicesSection}>
        <div className={styles.autoContainer}>
          <div className={styles.secTitle}>
            <div className={styles.header}>
              <h2> Services That We Offer </h2>
              <div className={styles.greenLine}></div>
            </div>
            <div className={styles.text}>
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation X is on the runway heading
              towards a streamlined cloud solution.
            </div>
          </div>
          <div className={styles.row}>
            {/* Dynamically map over the first 9 services from the API */}
            {services.slice(0, 9).map((service, index) => (
              <div key={service.service_id} className={styles.serviceBlockOne}>
                <div className={styles.innerBox}>
                  <h5>Service and Repairs</h5>
                  <h2>{service.service_name}</h2> {/* Replace static h2 with dynamic service name */}
                  <a href="#" className={styles.readMore}>
                    Read More +
                  </a>
                  <div className={styles.icon}>
                    {/* Render different icons for each service block based on index */}
                    {index === 0 && <FaPowerOff />}
                    {index === 1 && <FaCog />}
                    {index === 2 && <FaTachometerAlt />}
                    {index === 3 && <FaCar />}
                    {index === 4 && <FaTachometerAlt />}
                    {index === 5 && <FaPaintBrush />}
                    {/* Add more icons if needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className={styles.callToAction}>
        <div className={styles.contactusText}>
          <h2>Schedule Your Appointment Today</h2>
          <p>Your Automotive Repair & Maintenance Service Specialist</p>
        </div>
        <div className={styles.contactusButton}>
          <h2>1800.456.7890</h2>
          <Link to="/contactus" className={styles.contactButton}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
