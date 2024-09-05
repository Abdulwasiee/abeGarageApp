import React from "react";
import { useParams } from "react-router-dom"; // To get orderId from URL params
import SideBar from "../../../components/Admin/AdminMenu/AdminMenu";
import styles from "./OrderDetailPage.module.css";
import OrderDetail from "../../../components/Admin/OrderDetail/OrderDetail";

function OrderDetailPage() {
  // Use useParams hook to get the orderId from the URL
  const { orderId } = useParams();

  return (
    <div className={styles.container}>
      <SideBar />
      <OrderDetail orderId={orderId} /> {/* Pass orderId as a prop */}
    </div>
  );
}

export default OrderDetailPage;
