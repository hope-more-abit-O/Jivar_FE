import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/7537044.jpg';
import jivarData from '../../../jivar-api-data.json';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email) {
      // Check if the email already exists
      const existingUser = jivarData.account.find(account => account.email === email);

      if (existingUser) {
        setError("An account with this email already exists.");
      } else {
        // Add new user to the JSON data
        const newUser = {
          id: jivarData.account.length + 1,
          email: email,
          password: "", // In a real app, you'd hash the password
          phone: "",
          username: email.split('@')[0],
          birthday: null,
          gender: "",
          create_time: new Date().toISOString(),
          role: "user"
        };

        jivarData.account.push(newUser);

        // In a real app, you'd save this to a database or API
        console.log("New user added:", newUser);

        // Redirect to sign in page
        navigate("/authentication/sign-in");
      }
    } else {
      setError("Please enter an email address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F4F5F7]">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent 45%, white 45%, white 100%)'
          }}
        />
        <div className="absolute top-[15%] right-[20%] w-4 h-4 bg-[#0052CC] transform rotate-45" />
        <div className="absolute bottom-[15%] right-[10%] w-4 h-4 bg-[#36B37E] transform rotate-45" />
        <div className="absolute bottom-[20%] left-[15%] w-4 h-4 bg-[#0052CC] transform rotate-45" />
      </div>

      <div className="w-full max-w-[400px] bg-white shadow-lg rounded-lg relative z-10">
        <div className="text-center space-y-6 p-6">
          <img 
            src={logo}
            alt="Jivar" 
            className="h-12 mx-auto"
          />
          <h1 className="text-xl font-semibold text-[#253858]">Sign up to continue</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="text-xs text-[#42526E]">
            By signing up, I accept the{' '}
            <a href="#" className="text-[#0052CC] hover:underline">Jivar Cloud Terms of Service</a>
            {' '}and acknowledge the{' '}
            <a href="#" className="text-[#0052CC] hover:underline">Privacy Policy</a>.
          </div>
          <button type="submit" className="w-full h-10 bg-[#0052CC] hover:bg-[#0747A6] text-white rounded-md transition-colors duration-200">
            Sign up
          </button>
        </form>

        <div className="px-6 pb-6">
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-6 text-sm">
          <div className="text-center">
            <span className="text-[#42526E]">Already have an Jivar account? </span>
            <Link to="/authentication/sign-in" className="text-[#0052CC] hover:underline">
              Log in
            </Link>
          </div>
          
          <div className="text-center space-y-2">
            <img 
              src={logo} 
              alt="Jivar" 
              className="h-8 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}