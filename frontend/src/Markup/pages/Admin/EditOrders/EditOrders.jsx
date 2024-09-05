import React from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import EditOrder from "../../../components/Admin/EditOrder/EditOrder";
import styles from "./EditOrders.module.css";

function EditOrders() {
  // Use useParams to extract orderId from the URL
  const { orderId } = useParams();

  return (
    <div className={styles.container}>
      <SideBar />
      <EditOrder orderId={orderId} /> {/* Pass the orderId as a prop */}
    </div>
  );
}

export default EditOrders;
