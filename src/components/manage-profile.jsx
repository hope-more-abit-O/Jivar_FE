import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { User, Mail, Phone, Cake, Users } from 'lucide-react';
import Navigation from './navigation/navigation';
import axios from 'axios';
import accountAPI from '../apis/accountApi';

export default function ManageProfile() {
    const [user, setUser] = useState({
        id:'',
        name:'',
        email: '',
        phone: '',
        birthday: '',
        gender: '',
        role:'',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('accessToken');
            if (!token) {
                navigate('/authentication/sign-in');
                return;
            }

            try {
                const userId = Cookies.get('userId');
                const res = await axios.get(`http://localhost:5287/api/v1/account/info/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log(res.data);
                setUser(res.data);

            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Updated user data:", user);
    
        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('phone', user.phone);
            formData.append('birthday', user.birthday);
            formData.append('gender', user.gender);
    
            const token = Cookies.get('accessToken');
            if (!token) {
                console.error('No token found. Redirecting to login.');
                navigate('/authentication/sign-in');
                return;
            }
    
            const response = await axios.put('http://localhost:5287/api/v1/account/info', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Profile updated successfully:', response.data);
            window.alert('Profile updated successfully!');
            window.location.reload()
        } catch (error) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                window.alert(`Update failed: ${error.response.data.message || 'An error occurred.'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                window.alert('Update failed: No response from server.');
            } else {
                console.error('Error:', error.message);
                window.alert(`Update failed: ${error.message}`);
            }
        }
    };
    

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>

        );
    }

    if (error) {
        return (
            <>
                <Navigation />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500 text-xl font-semibold">{error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <div className="max-w-md mx-auto">
                            <div>
                                <h1 className="text-2xl font-semibold text-center">Manage Your Profile</h1>
                                <p className="mt-2 text-center text-gray-600">Update your personal information</p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                                    <div className="relative">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={user.name}
                                            onChange={handleInputChange}
                                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
                                            placeholder="Name"
                                        />
                                        <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            <User className="inline w-4 h-4 mr-2" />
                                            Name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user.email}
                                            onChange={handleInputChange}
                                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
                                            placeholder="Email address"
                                        />
                                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            <Mail className="inline w-4 h-4 mr-2" />
                                            Email address
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={user.phone}
                                            onChange={handleInputChange}
                                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
                                            placeholder="Phone number"
                                        />
                                        <label htmlFor="phone" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            <Phone className="inline w-4 h-4 mr-2" />
                                            Phone number
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="birthday"
                                            name="birthday"
                                            type="date"
                                            value={user.birthday ? user.birthday.split('T')[0] : ''}
                                            onChange={handleInputChange}
                                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600"
                                        />
                                        <label htmlFor="birthday" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            <Cake className="inline w-4 h-4 mr-2" />
                                            Birthday
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={user.gender}
                                            onChange={handleInputChange}
                                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <label htmlFor="gender" className="absolute left-0 -top-3.5 text-gray-600 text-sm">
                                            <Users className="inline w-4 h-4 mr-2" />
                                            Gender
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}