import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./CustomerOrders.module.css";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]); // Ensure initial state is an empty array
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const [ordersPerPage] = useState(5); // Number of orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:2030/api/orders");
        if (response.data) {
          setOrders(response.data); // Set the orders only if data exists
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Safeguard to ensure `orders` exists before filtering
  const filteredOrders = (orders || []).filter(
    (order) =>
      order.customer_first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer_last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusClass = (status) => {
    switch (status) {
      case "Vehicle Dropped Off":
        return styles.statusInProgress;
      case "Parts Ordered":
        return styles.statusYellow;
      case "Waiting for Customer":
      case "Ready for Pickup":
      case "Picked Up":
        return styles.statusGreen;
      default:
        return styles.statusInProgress;
    }
  };

  const handleDelete = async (order_id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:2030/api/orders/${order_id}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== order_id)
        );
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          List Of Orders <span className={styles.titleUnderline}></span>
        </h2>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by Customer Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {currentOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Received By</th>
              <th>View/Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>
                  {order.customer_first_name} {order.customer_last_name}
                  <br />
                  {order.customer_email}
                  <br />
                  {order.customer_phone_number}
                </td>
                <td>
                  {order.vehicle_model} ({order.vehicle_year})
                  <br />
                  Tag: {order.vehicle_tag}
                </td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>
                  <span className={getStatusClass(order.order_status)}>
                    {order.order_status}
                  </span>
                </td>
                <td>{order.received_by || "Not yet received"}</td>
                <td className={styles.viewEdit}>
                  <Link to={`/admin/orders/view/${order.order_id}`}>
                    <FaEye />
                  </Link>
                  <Link to={`/admin/orders/edit/${order.order_id}`}>
                    <FaEdit />
                  </Link>
                  <FaTrashAlt
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(order.order_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>{currentPage}</span>
        <button
          className={styles.paginationButton}
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastOrder >= filteredOrders.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerOrders;
