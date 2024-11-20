import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Card,
    Typography,
    Button,
    Input,
    IconButton,
    Tooltip,
    Alert,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Navigation from './navigation/navigation';
import axios from 'axios';
import projectAPI from '../apis/projectApi';

export default function ViewAllProjects() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: 'createTime',
        direction: 'desc'
    });
    const [sortOption, setSortOption] = useState('desc');

    const projectsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            console.log(`a`);
            const token = Cookies.get('accessToken');
            console.log(token);
            if (!token) {
                navigate('/authentication/sign-in');
                return;
            }

            try {
                const res = await projectAPI.getByUser();
                console.log(res);
                // if (!res.ok) {
                //     throw new Error(`HTTP error! status: ${res.status}`);
                // }

                setProjects(res.data || []);
            } catch (error) {
                console.log(error);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSortOptionChange = (e) => {
        setSortOption(e.target.value);
        setSortConfig({ key: 'createTime', direction: e.target.value });
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const getSortedProjects = () => {
        const sortedProjects = [...projects].filter((project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return sortedProjects.sort((a, b) => {
            if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

            const aValue = a[sortConfig.key].toString().toLowerCase();
            const bValue = b[sortConfig.key].toString().toLowerCase();

            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return null;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUpIcon className="h-4 w-4 inline-block ml-1" /> :
            <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />;
    };

    const getTooltipContent = (columnName) => {
        if (sortConfig.key === columnName) {
            return `${columnName} • ${sortConfig.direction === 'asc' ? 'Z → A' : 'A → Z'}`;
        }
        return `${columnName} • A → Z`;
    };

    const paginatedProjects = getSortedProjects().slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleProjectClick = (projectId) => {
        navigate(`/jivar/project/${projectId}/board`);
    };

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner-border text-blue-500" role="status"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation />
                <div className="flex flex-col justify-center items-center h-screen text-red-500">
                    <Typography>{error}</Typography>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 text-white"
                    >
                        Retry
                    </Button>
                </div>
            </>
        );
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'createBy', label: 'Owner' },
    ];

    return (
        <>
            {successMessage && (
                <Alert
                    color="green"
                    className="fixed top-5 right-5 z-50 w-[300px] shadow-lg font-medium border-[#2ec946] bg-[#2ec946]/10 text-[#2ec946]"
                >
                    {successMessage}
                </Alert>
            )}

            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="h1" className="text-2xl font-semibold">
                        Your Work
                    </Typography>
                    <Link to="/jivar/create-project">
                        <Button
                            size="md"
                            className="bg-blue-500 hover:bg-blue-600 transition-colors normal-case rounded-lg shadow-none hover:shadow-none"
                        >
                            Create project
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex w-full max-w-[25rem]">
                        <Input
                            type="search"
                            placeholder="Search projects"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pr-20 rounded-md text-start placeholder:text-start border border-gray-300 focus:ring-2 h-[2.25rem]"
                            containerProps={{
                                className: "",
                            }}
                        />
                    </div>
                    <div className="relative w-64">
                        <select
                            value={sortOption}
                            onChange={handleSortOptionChange}
                            className="appearance-none w-full h-[42px] bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                        >
                            <option value="desc">Newest to Oldest</option>
                            <option value="asc">Oldest to Newest</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {paginatedProjects.length === 0 ? (
                    <Typography className="text-center text-gray-500 py-4">
                        No projects found.
                    </Typography>
                ) : (
                    <Card className="overflow-auto max-h-[500px] w-full">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer hover:bg-blue-gray-100 transition-colors relative"
                                            onClick={() => requestSort(column.key)}
                                        >
                                            <Tooltip content={getTooltipContent(column.label)} placement="top">
                                                <div className="inline-block">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal leading-none opacity-70 flex items-center"
                                                    >
                                                        {column.label}
                                                        {getSortIcon(column.key)}
                                                    </Typography>
                                                </div>
                                            </Tooltip>
                                        </th>

                                    ))}
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Actions
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProjects.map((project, index) => {
                                    const isLast = index === paginatedProjects.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={project.id} className="hover:bg-blue-gray-50 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <StarIcon className="h-5 w-5 text-blue-gray-400" />
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {project.name}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {project.description}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {project.createBy?.name || "Unknown"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <IconButton variant="text" color="blue-gray">
                                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Card>
                )}

                <div className="flex justify-center mt-6">
                    {Array.from({ length: Math.ceil(getSortedProjects().length / projectsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}