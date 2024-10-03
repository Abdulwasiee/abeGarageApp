import React from "react";
import { useUser } from "../../../../context/UserContext"; // Import the useUser hook
import { ROLES } from "../../../../constants/roles"; // Import the ROLES constant
import styles from "./AdminMenu.module.css"; // Import CSS

function SideBar() {
  const { user } = useUser(); // Get the logged-in user data
  const userRole = user?.role; // Extract the user's role

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Menu</h2>
        <ul className={styles.navLinks}>
          <li>
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/admin/orders">Orders</a>
          </li>

          {/* Hide these links for EMPLOYEE role */}
          {userRole !== ROLES.EMPLOYEE && (
            <>
              <li>
                <a href="/admin/add-order">New Order</a>
              </li>
              <li>
                <a href="/admin/add-employee">Add Employee</a>
              </li>
              <li>
                <a href="/admin/employees">Employees</a>
              </li>
              <li>
                <a href="/admin/add-customer">Add Customer</a>
              </li>
              <li>
                <a href="/admin/customers">Customers</a>
              </li>
              <li>
                <a href="/admin/services">Services</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
