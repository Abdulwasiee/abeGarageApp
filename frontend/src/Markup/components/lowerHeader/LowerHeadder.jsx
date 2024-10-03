import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import styles from "./lowerheader.module.css";
import logo from "../../../assets/images/logo.png";
import { FaBars, FaTimes } from "react-icons/fa"; // Import hamburger and close icons

const LowerHeader = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility
  const sidebarRef = useRef(); // Ref to detect clicks outside the sidebar

  // Function to handle the logout process
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to determine the correct route based on the user's role
  const getHomeRoute = () => {
    if (user) {
      if (user.role === "Admin" || user.role === "Manager") {
        return "/admin/dashboard";
      } else if (user.role === "Employee") {
        return "/admin/orders";
      }
    }
    return "/"; // Default route if no user is logged in
  };

  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar if a click is detected outside the sidebar
  const handleClickOutside = (event) => {
    if (
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  // Add event listener to detect clicks outside the sidebar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.headerUpper}>
      <div className={styles.container}>
        <div className={styles.logoBox}>
          <div className={styles.logo}>
            <Link to={getHomeRoute()}>
              <img src={logo} alt="Abie-garage" />
            </Link>
          </div>
        </div>

        {/* Hamburger icon for screens below 775px */}
        <div className={`${styles.hamburgerMenu} d-md-none`}>
          <button onClick={toggleSidebar} className={styles.hamburgerIcon}>
            <FaBars />
          </button>
        </div>

        {/* Default navigation for screens above 775px */}
        <div className={`${styles.rightColumn} d-none d-md-flex`}>
          <nav className={`${styles.mainMenu}`}>
            <ul className={styles.navigation}>
              <li className={styles.navItem}>
                <Link to={getHomeRoute()}>Home</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/services">Services</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/contactus">Contact Us</Link>
              </li>
              {user?.role === "Admin" || user?.role === "Manager" ? (
                <li className={styles.navItem}>
                  <Link to="/admin/dashboard">Admin</Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <div className={styles.linkBtn}>
            {user ? (
              <button onClick={handleLogout} className={styles.bookButton}>
                Logout
              </button>
            ) : (
              <Link to="/login" className={styles.bookButton}>
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar for screens below 775px */}
        <div
          ref={sidebarRef} // Sidebar reference
          className={`${styles.sidebar} ${isOpen ? styles.showSidebar : ""}`}
        >
          <div className={styles.sidebarContent}>
            <button onClick={toggleSidebar} className={styles.closeIcon}>
              <FaTimes />
            </button>
            <nav className={styles.sidebarNav}>
              <ul className={styles.sidebarLinks}>
                <li>
                  <Link to={getHomeRoute()} onClick={toggleSidebar}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/aboutus" onClick={toggleSidebar}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" onClick={toggleSidebar}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/contactus" onClick={toggleSidebar}>
                    Contact Us
                  </Link>
                </li>
                {user?.role === "Admin" || user?.role === "Manager" ? (
                  <li>
                    <Link to="/admin/dashboard" onClick={toggleSidebar}>
                      Admin
                    </Link>
                  </li>
                ) : null}
                <li>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className={styles.logoutButton}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={toggleSidebar}
                      className={styles.logoutButton}
                    >
                      Sign In
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerHeader;
