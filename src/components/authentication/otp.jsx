import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpEntry = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { value } = e.target;
    // Only allow numeric input and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (otp.length === 6) {
            console.log(otp);
            const response = await axios.get(
              `https://localhost:7150/api/Account/verify?token=${otp}`
          );
          if (response.status === 200) {
              navigate("/authentication/sign-in");
          }
        }

    } catch (error) {
      alert(error.response.data.error);
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter OTP</h2>
      <p style={styles.instructions}>
        A one-time password (OTP) has been sent to your registered mobile number or email.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={otp}
          onChange={handleInputChange}
          placeholder="Enter OTP"
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

// Sample inline styles (can be replaced with CSS or styled-components)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  instructions: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  resendButton: {
    backgroundColor: "transparent",
    color: "#007BFF",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default OtpEntry;
