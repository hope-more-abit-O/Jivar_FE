import { Menu, Spinner } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/7537044.jpg';
import jivarData from '../../../jivar-api-data.json';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
    const [openMenu, setOpenMenu] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [tokenInfo, setTokenInfo] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTokenInfo("");
        setIsSigningIn(true);

        try {
            if (email && password) {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check if the email and password match any account in the JSON data
                const user = jivarData.account.find(account => 
                    account.email === email && account.password === password
                );

                if (user) {
                    // Successful login
                    // Generate a mock bearer token (in a real app, this would come from the server)
                    const bearerToken = `mock_token_${user.id}_${Date.now()}`;

                    // Store the bearer token in a cookie
                    Cookies.set('accessToken', bearerToken, { expires: 7 });
                    
                    setTimeout(() => {
                        setIsSigningIn(false);
                        navigate("/jivar/your-work");
                    }, 5000);
                } else {
                    setError("Invalid email or password. Please try again.");
                    setIsSigningIn(false);
                }
            } else {
                setError("Please enter both email and password.");
                setIsSigningIn(false);
            }
        } catch (err) {
            setError("Failed to sign in. Please try again.");
            setIsSigningIn(false);
        }
    };

    const checkStoredToken = () => {
        const storedToken = Cookies.get('accessToken');
        if (storedToken) {
            setTokenInfo(`Stored token: ${storedToken}`);
        } else {
            setTokenInfo("No token found in cookies.");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading || location.state?.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner color='red' />
            </div>
        );
    }

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
                <div className="text-center space-y-6 p-6 border-b border-gray-200">
                    <img
                        src={logo}
                        alt="Jivar"
                        className="h-12 mx-auto"
                    />
                    <h1 className="text-xl font-semibold text-[#253858]">Log in to continue</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {tokenInfo && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <p className="block sm:inline"> {tokenInfo}</p>
                        </div>
                    )}
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
                            type={showPassword ? "text" : "password"}
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
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-10 bg-[#0052CC] hover:bg-[#0747A6] text-white rounded-md transition-colors duration-200 flex items-center justify-center"
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
                </form>
                <div className="p-6 border-t border-gray-200 space-y-6 text-sm">
                    <div className="flex justify-center space-x-2">
                        <a href="#" className="text-[#0052CC] hover:underline">Can't log in?</a>
                        <span>•</span>
                        <Link
                            to="/authentication/sign-up"
                            className="text-[#0052CC] hover:underline">
                            Create an account
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