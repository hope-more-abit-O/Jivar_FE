import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/7537044.jpg";
import axios from "axios";
import { Transition } from "@headlessui/react";
import { Alert } from "@material-tailwind/react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    username: "",
    birthday: "",
    gender: "",
    feurl: "",
  });
  const [message, setMessage] = useState(""); // For both error and success messages
  const [messageType, setMessageType] = useState(""); // Type of alert (red for error, green for success)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { email, password, phone, username, birthday, gender } = formData;
    if (!email || !password || !phone || !username || !birthday || !gender) {
      setMessageType("red");
      setMessage("All fields are required. Please fill out the entire form.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const validateBirthday = (date) => {
      const currentDate = new Date().toISOString().split("T")[0];
      if (date > currentDate) {
        setMessageType("red");
        setMessage("Birthday cannot be a future date.");
      } else {
        setMessage("");
      }
    };
    
    try {
      const response = await axios.post("https://localhost:7150/api/v1/auth/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessageType("green");
        setMessage("Đăng kí thành công!");
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setLoading(false);

      if (error.response) {
        const { status, data } = error.response;
        setMessageType("red");
        if (status === 400) {
          setMessage("Invalid input. Please check your details and try again.");
        } else if (status === 409) {
          setMessage(data?.detail || "Email already exists in the system.");
        } else if (status === 500) {
          setMessage(data?.detail || "An internal server error occurred. Please try again later.");
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        setMessage("Network error. Please check your internet connection and try again.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {message && (
        <Transition
          show={!!message}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Alert
            color={messageType === "green" ? "green" : "red"}
            className={`fixed top-5 right-5 z-50 w-[300px] shadow-lg font-medium ${messageType === "green"
              ? "border-[#2ec946] bg-[#2ec946]/10 text-[#2ec946]"
              : "border-[#f44336] bg-[#f44336]/10 text-[#f44336]"
              }`}
          >
            {message}
          </Alert>

        </Transition>
      )}

      <div className="absolute inset-0 bg-[#F4F5F7]">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 45%, white 45%, white 100%)",
          }}
        />
        <div className="absolute top-[15%] right-[20%] w-4 h-4 bg-[#0052CC] transform rotate-45" />
        <div className="absolute bottom-[15%] right-[10%] w-4 h-4 bg-[#36B37E] transform rotate-45" />
        <div className="absolute bottom-[20%] left-[15%] w-4 h-4 bg-[#0052CC] transform rotate-45" />
      </div>

      <div className="w-full max-w-[400px] bg-white shadow-lg rounded-lg relative z-10">
        <div className="text-center space-y-6 p-6">
          <img src={logo} alt="Jivar" className="h-12 mx-auto" />
          <h1 className="text-xl font-semibold text-[#253858]">Sign up to continue</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Enter your name number"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            name="birthday"
            placeholder="Enter your birthday"
            value={formData.birthday}
            onChange={(e) => {
              handleInputChange(e);
              validateBirthday(e.target.value);
            }}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div className="text-xs text-[#42526E]">
            By signing up, I accept the{" "}
            <a href="#" className="text-[#0052CC] hover:underline">
              Jivar Cloud Terms of Service
            </a>{" "}
            and acknowledge the{" "}
            <a href="#" className="text-[#0052CC] hover:underline">
              Privacy Policy
            </a>
            .
          </div>
          <button
            type="submit"
            className={`w-full h-10 bg-[#0052CC] text-white rounded-md transition-colors duration-200 flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0747A6]"
              }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loader inline-block w-4 h-4 border-2 border-t-white border-b-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="p-6 border-t border-gray-200 space-y-6 text-sm">
          <div className="text-center">
            <span className="text-[#42526E]">Already have a Jivar account? </span>
            <div className="flex flex-col">
            <Link to="/authentication/sign-in" className="text-[#0052CC] hover:underline">
              Log in
            </Link>
            
            <Link to="/authentication/otp" className="text-[#0052CC] hover:underline">
              Verify
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
