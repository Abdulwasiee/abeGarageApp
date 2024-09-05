import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import styles from "./Login.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Loading from "../../components/Loading/Loading";
import axios from "axios";

function Login() {
  const [employee_email, setEmployeeEmail] = useState("");
  const [employee_password, setEmployeePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      employee_email,
      employee_password,
    };

    const apiUrl = "http://localhost:2030/api/login";

    try {
      const response = await axios.post(apiUrl, data);

      if (response.status === 200) {
        const {
          employee_id,
          employee_first_name,
          employee_email,
          employee_last_name,
          role,
          token,
        } = response.data.employee;

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Update context with user’s information, including employee_id
        login({ employee_id, employee_first_name, employee_last_name, employee_email, role });

        // Redirect based on the user's role
        if (role === "Admin" || role === "Manager") {
          navigate("/admin/dashboard");
        } else if (role === "Employee") {
          navigate("/orders");
        }
      } else {
        const result = response.data;
        setResponseMessage(result.message);
      }
    } catch (error) {
     
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3 className={styles.loginheader}>Login to your Account Here</h3>
        <div className={styles.greenLine}></div>
      </div>
      <div className={styles.responseMessage}>
        {responseMessage && <h4>{responseMessage}</h4>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="employee_email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="employee_email"
          name="employee_email"
          value={employee_email}
          onChange={(e) => setEmployeeEmail(e.target.value)}
          className={styles.input}
          placeholder="Enter your email"
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
            value={employee_password}
            onChange={(e) => setEmployeePassword(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
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
        Login
      </button>
    </form>
  );
}

export default Login;
