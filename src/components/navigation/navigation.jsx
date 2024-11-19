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

const navItems = [
    { name: 'Your work', path: '/jivar/your-work' },
    { name: 'Projects' },
    { name: 'Dashboards' },
    { name: 'Teams' },
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
            if (token == null) {
                navigate('/authentication/sign-in');
                return;
            }


            try {
                const userId = Cookies.get('account_id');
                console.log(userId);

                const res = await fetch(`http://localhost:8008/account?id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(res);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log("Fetched user data:", data[0]);
                setUser(data[0]);

            } catch (error) {
                console.error("Failed to fetch data:", error);
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

    const renderTeamsMenu = () => (
        <div className="relative" ref={teamsDropdownRef}>
            <Menu
                open={isTeamsOpen}
                handler={setIsTeamsOpen}
                placement="bottom-start"
                offset={-4}
            >
                <MenuHandler>
                    <Button
                        variant="text"
                        className="flex items-center text-[#42526E]"
                        onClick={() => handleItemClick('Teams')}
                    >
                        Teams <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                </MenuHandler>
                <MenuList className="w-[300px] p-0">
                    <MenuItem className="flex items-center gap-3 p-3 hover:bg-blue-50/80">
                        <Plus className="h-4 w-4" />
                        <Typography variant="small" className="font-normal">
                            Invite people to Jira
                        </Typography>
                    </MenuItem>
                    <MenuItem className="flex items-center gap-3 p-3 hover:bg-blue-50/80">
                        <Users className="h-4 w-4" />
                        <Typography variant="small" className="font-normal">
                            Create a team
                        </Typography>
                    </MenuItem>
                    <hr className="my-2" />
                    <div className="p-3">
                        <MenuItem className="py-2 hover:bg-blue-50/80">
                            <Typography variant="small" className="font-normal text-gray-600">
                                Search people and teams
                            </Typography>
                        </MenuItem>
                    </div>
                </MenuList>
            </Menu>
        </div>
    );

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
                                    src={logo}
                                    alt={user ? user.username : 'Profile'}
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
                                        {user ? user.username.substring(0, 2).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            {user ? user.username : 'User'}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {user ? user.email : 'user@example.com'}
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
                                    <MenuItem className="flex items-center justify-between hover:bg-blue-50/80">
                                        <span>Notifications</span>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">NEW</span>
                                    </MenuItem>
                                    <MenuItem className="flex items-center justify-between hover:bg-blue-50/80">
                                        <span>Theme</span>
                                        <ChevronRight className="h-4 w-4" />
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
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                                        INCLUDED FREE WITH YOUR PLAN
                                                    </Typography>
                                                    <MenuItem className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <img src={logo} alt="Sample" className="w-6 h-6" />
                                                            <div>
                                                                <Typography variant="small" color="blue-gray" className="font-medium">
                                                                    Go-to-market sample
                                                                </Typography>
                                                                <Typography variant="small" color="gray" className="font-normal">
                                                                    Business project
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <Button variant="text" color="blue" size="sm" className="text-xs">
                                                            TRY NOW
                                                        </Button>
                                                    </MenuItem>
                                                </div>
                                            </div>
                                            <hr className="my-2" />
                                            <MenuItem>
                                                <Link to={'/jivar/projects'}>
                                                    <Typography variant="small" className="font-normal">
                                                        View all projects
                                                    </Typography>
                                                </Link>

                                            </MenuItem>
                                            <MenuItem>
                                                <Link to="/jivar/create-project" className="w-full">
                                                    <Typography variant="small" className="font-normal">
                                                        Create project
                                                    </Typography>
                                                </Link>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            ) : item.name === 'Teams' ? (
                                renderTeamsMenu()
                            ) : (
                                item.name === 'Your work' ? (
                                    <Link key={item.name} to={item.path}>
                                        <Button
                                            variant="text"
                                            className="flex items-center text-[#42526E]"
                                            onClick={() => handleItemClick(item.name, item.path)}
                                        >
                                            {item.name}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        key={item.name}
                                        variant="text"
                                        className="flex items-center text-[#42526E]"
                                        onClick={() => handleItemClick(item.name)}
                                    >
                                        {item.name}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </Button>
                                )
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
                        <Bell className="h-5 w-5 text-[#42526E] flex" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </IconButton>
                    {renderProfileMenu()}
                </div>
            </div>
        </Navbar>
    );
}