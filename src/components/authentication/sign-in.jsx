import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Spinner, Alert } from '@material-tailwind/react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/7537044.jpg';
import { Transition } from '@headlessui/react';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Show the success message when redirected with state
        if (location.state?.successMessage) {
            setMessage(location.state.successMessage);
            setMessageType('green');
            // Clear the message from state after showing it
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setIsSigningIn(true);

        try {
            if (email && password) {
                const formData = new FormData();
                formData.append('Email', email);
                formData.append('Password', password);

                const response = await axios.post(
                    'https://localhost:7150/api/v1/auth/login',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 200) {
                    const { token, email: userEmail, roleName, actorId } = response.data;
                    Cookies.set('accessToken', token);
                    Cookies.set('userId', actorId )
                    Cookies.set('email', userEmail);
                    Cookies.set('roleName', roleName);

                    navigate('/jivar/your-work', {
                        state: { successMessage: 'Login successful!' },
                    });
                }
            } else {
                setMessageType('red');
                setMessage('Please enter both email and password.');
            }
        } catch (err) {
            setMessageType('red');
            setMessage('Invalid email or password. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

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
                        color={messageType === 'green' ? 'green' : 'red'}
                        className={`fixed top-5 right-5 z-50 w-[300px] shadow-lg font-medium ${
                            messageType === 'green'
                                ? 'border-[#2ec946] bg-[#2ec946]/10 text-[#2ec946]'
                                : 'border-[#f44336] bg-[#f44336]/10 text-[#f44336]'
                        }`}
                    >
                        {message}
                    </Alert>
                </Transition>
            )}

            <div className="w-full max-w-[400px] bg-white shadow-lg rounded-lg relative z-10">
                <div className="text-center space-y-6 p-6 border-b border-gray-200">
                    <img src={logo} alt="Jivar" className="h-12 mx-auto" />
                    <h1 className="text-xl font-semibold text-[#253858]">Log in to continue</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className={`w-full h-10 bg-[#0052CC] text-white rounded-md transition-colors duration-200 flex items-center justify-center ${
                            isSigningIn ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0747A6]'
                        }`}
                        disabled={isSigningIn}
                    >
                        {isSigningIn ? (
                            <>
                                <Spinner color="white" size="sm" className="mr-2" />
                                Signing In...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </button>

                    <button
                        className={`w-full h-10 bg-[#0052CC] text-white rounded-md transition-colors duration-200 flex items-center justify-center ${
                            isSigningIn ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0747A6]'
                        }`}
                        disabled={isSigningIn}
                        onClick={() => {navigate("/authentication/sign-up")}}
                    >
                        {isSigningIn ? (
                            <>
                                <Spinner color="white" size="sm" className="mr-2" />
                                Signing In...
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </button>
                </form>
                
            </div>
        </div>
    );
}
