import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading || location.state?.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
                <div
                    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                >
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[#F4F5F7]">
                {/* Main diagonal shape */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, transparent 45%, white 45%, white 100%)'
                    }}
                />

                {/* Blue accent square - top right */}
                <div className="absolute top-[15%] right-[20%] w-4 h-4 bg-[#0052CC] transform rotate-45" />

                {/* Green accent square - bottom right */}
                <div className="absolute bottom-[15%] right-[10%] w-4 h-4 bg-[#36B37E] transform rotate-45" />

                {/* Blue accent square - bottom left */}
                <div className="absolute bottom-[20%] left-[15%] w-4 h-4 bg-[#0052CC] transform rotate-45" />
            </div>

            {/* Sign in card */}
            <div className="w-full max-w-[400px] bg-white shadow-lg rounded-lg relative z-10">
                <div className="text-center space-y-6 p-6 border-b border-gray-200">
                    <img
                        src="/placeholder.svg?height=48&width=180"
                        alt="Jivar"
                        className="h-12 mx-auto"
                    />
                    <h1 className="text-xl font-semibold text-[#253858]">Log in to continue</h1>
                </div>

                <div className="p-6 space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="w-full h-10 bg-[#0052CC] hover:bg-[#0747A6] text-white rounded-md transition-colors duration-200">
                        Continue
                    </button>
                </div>

                <div className="p-6 border-t border-gray-200 space-y-6 text-sm">
                    <div className="flex justify-center space-x-2">
                        <a href="#" className="text-[#0052CC] hover:underline">Can't log in?</a>
                        <span>•</span>
                        <a href="#" className="text-[#0052CC] hover:underline">Create an account</a>
                    </div>

                    <div className="text-center space-y-2">
                        <img
                            src="/placeholder.svg?height=32&width=120"
                            alt="Jivar"
                            className="h-8 mx-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}