import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Navbar,
    Typography,
    Button,
    IconButton,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import {
    ChevronDown,
    Search,
    Bell,
    HelpCircle,
    Settings,
    Plus,
    Users,
    ChevronRight,
    ExternalLink,
    LogOut,
} from 'lucide-react';

import logo from '../../assets/7537044.jpg';
import jivarData from '../../../jivar-api-data.json';
import axios from 'axios';

const navItems = [
    { name: 'Projects' },
    { name: 'Dashboards', path: '/jivar/dashboard' }
];

export default function Navigation() {
    const [activeItem, setActiveItem] = useState('');
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const teamsDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = Cookies.get('accessToken');
    //     if (token) {
    //         const foundUser = jivarData.account.find(account => 
    //             jivarData.account_token.some(t => t.account_id === account.id && t.accessToken === token)
    //         );
    //         if (foundUser) {
    //             setUser(foundUser);
    //         }
    //     }
    // }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('accessToken');
            if (!token) {
                navigate('/authentication/sign-in');
                return;
            }

            try {
                const userId = Cookies.get('userId');
                if (!userId) {
                    console.error("User ID is missing in cookies");
                    return;
                }

                const res = await axios.get(`http://localhost:5287/api/v1/account/info/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleItemClick = (itemName, path) => {
        setActiveItem(itemName);
        if (path) {
            navigate(path);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProjectsOpen(false);
            }
            if (teamsDropdownRef.current && !teamsDropdownRef.current.contains(event.target)) {
                setIsTeamsOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('userId');
        Cookies.remove('roleName');
        Cookies.remove('email');
        Cookies.remove('projectId');
        setUser(null);
        navigate('/authentication/sign-in');
    };



    const renderProfileMenu = () => (

        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="relative" ref={profileDropdownRef}>
                    <Menu
                        open={isProfileOpen}
                        handler={setIsProfileOpen}
                        placement="bottom-end"
                        offset={4}
                    >
                        <MenuHandler>
                            <IconButton variant="text" className="flex justify-center">
                                <Avatar
                                    src={user?.profilePicture || logo}
                                    alt={user?.username || 'Profile'}
                                    size="xs"
                                    className="cursor-pointer"
                                />
                            </IconButton>
                        </MenuHandler>
                        <MenuList className="w-[240px] p-0">
                            <div className="p-3 border-b border-gray-200">
                                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                    Account
                                </Typography>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            {user?.name || 'User'}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {user?.email || 'user@example.com'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-b border-gray-200">
                                <div className="space-y-1">
                                    <MenuItem className="hover:bg-blue-50/80 flex justify-start">
                                        <Link to={'/jivar/manage-profile'}>
                                            Manage Profile
                                        </Link>
                                    </MenuItem>
                                </div>
                            </div>
                            <MenuItem className="flex items-center gap-2 p-3 text-red-500 hover:bg-red-50/80" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Log out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            )}
        </div>
    );



    return (
        <Navbar className="max-w-full rounded-none px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between text-blue-gray-900">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo} alt="Jira" className="h-8" />
                        <Typography variant="h6" color="blue-gray">Jira</Typography>
                    </Link>
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            item.name === 'Projects' ? (
                                <div key={item.name} className="relative" ref={dropdownRef}>
                                    <Menu open={isProjectsOpen} handler={setIsProjectsOpen}>
                                        <MenuHandler>
                                            <Button
                                                variant="text"
                                                className="flex items-center text-[#42526E]"
                                                onClick={() => handleItemClick(item.name)}
                                            >
                                                {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                                            </Button>
                                        </MenuHandler>
                                        <MenuList className="w-[400px]">
                                            <MenuItem>
                                                <Link to={'/jivar/projects'}>
                                                    <Typography variant="small" className="font-normal flex justify-center">
                                                        View all projects
                                                    </Typography>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to="/jivar/create-project" className="w-full">
                                                    <Typography variant="small" className="font-normal flex justify-center">
                                                        Create project
                                                    </Typography>
                                                </Link>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            ) : (
                                <Link key={item.name} to={item.path || '#'}>
                                    <Button
                                        variant="text"
                                        className="flex items-center text-[#42526E]"
                                        onClick={() => handleItemClick(item.name, item.path)}
                                    >
                                        {item.name}
                                    </Button>
                                </Link>
                            )
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{
                                className: "min-w-[100px]",
                            }}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <IconButton variant="text" className="flex justify-center">
                    </IconButton >
                    {renderProfileMenu()}
                </div>
            </div>
        </Navbar>
    );
}