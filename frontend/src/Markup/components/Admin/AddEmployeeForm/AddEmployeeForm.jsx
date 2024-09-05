import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddEmployeeForm.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUser } from "../../../../context/UserContext"; // Import the useUser hook

function AddEmployee() {
  const { user } = useUser(); // Access the logged-in user's data
  const [responseMessage, setResponseMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // Log user object for debugging
  console.log("User Info:", user);
  const [employeeForm, setEmployeeForm] = useState({
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    company_role_name: "",
    active_employee: 1,
    employee_email: "",
    employee_password: "",
    created_by: user?.employee_first_name, // Dynamically set created_by to the logged-in user's name
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const apiUrl = "http://localhost:2030/api/employee/";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeForm),
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message);
        setEmployeeForm({
          employee_first_name: "",
          employee_last_name: "",
          employee_phone: "",
          company_role_name: "",
          active_employee: 1,
          employee_email: "",
          employee_password: "",
          created_by: user?.name, // Reset created_by to the logged-in user's name
        });

        setTimeout(() => {
          navigate("/employees");
        }, 1000);
      } else {
        setResponseMessage(result.error || "An unexpected error occurred.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  const validateFields = () => {
    const {
      employee_first_name,
      employee_last_name,
      employee_email,
      employee_password,
    } = employeeForm;
    if (
      !employee_first_name ||
      !employee_last_name ||
      !employee_email ||
      !employee_password
    ) {
      setResponseMessage("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Add a new employee</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.responseMessage}>
            {responseMessage && <h3>{responseMessage}</h3>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employee_first_name" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="employee_first_name"
              name="employee_first_name"
              value={employeeForm.employee_first_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Employee First Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employee_last_name" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="employee_last_name"
              name="employee_last_name"
              value={employeeForm.employee_last_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Employee Last Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employee_phone" className={styles.label}>
              Phone Number
            </label>
            <input
              type="text"
              id="employee_phone"
              name="employee_phone"
              value={employeeForm.employee_phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Employee Phone Number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company_role_name" className={styles.label}>
              Role
            </label>
            <select
              id="company_role_name"
              name="company_role_name"
              value={employeeForm.company_role_name}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employee_email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="employee_email"
              name="employee_email"
              value={employeeForm.employee_email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Employee Email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="employee_password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="employee_password"
                name="employee_password"
                value={employeeForm.employee_password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter Employee Password"
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
