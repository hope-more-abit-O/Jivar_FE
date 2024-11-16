import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Card,
    Typography,
    Button,
    Input,
    IconButton,
    Option,
    Select
} from "@material-tailwind/react";
import { ChevronDownIcon, MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Navigation from './navigation/navigation';

export default function ViewAllProjects() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [sortOption, setSortOption] = useState('desc');
    const [selectedVersion, setSelectedVersion] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sortOptions = [
        { value: 'desc', label: 'Newest to Oldest' },
        { value: 'asc', label: 'Oldest to Newest' }
    ];
    useEffect(() => {
        const fetchProjects = async () => {
            const token = Cookies.get('accessToken');
            if (!token) {
                navigate('/authentication/sign-in');
                return;
            }

            try {
                const userId = Cookies.get('account_id');
                const res = await fetch(`http://localhost:8008/project?project_roles.account_id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortedProjects = [...projects]
    .filter(project => project.status === "ACTIVE")
    .sort((a, b) => {
        const dateA = new Date(a.create_time);
        const dateB = new Date(b.create_time);
        return sortOption === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const filteredProjects = sortedProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProjectClick = (projectId) => {
        navigate(`/jivar/project/${projectId}/board`);
    };

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="flex justify-center items-center h-screen">Loading...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation />
                <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="h1" className="text-2xl font-semibold">
                        Projects
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
                    <div className="relative flex w-full max-w-[24rem]">
                        <Input
                            type="search"
                            placeholder="Search projects"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-20 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                    </div>

                    <div className="relative w-64">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="appearance-none w-full h-[42px] bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                        >
                            <option value="" disabled hidden>Sort by</option>
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>


                <Card className="overflow-scroll h-full w-full">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {["Name", "Description", "Creator", "Actions"].map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project, index) => {
                                const isLast = index === filteredProjects.length - 1;
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
                                                {project.create_by[0].username}
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
            </div>
        </>
    );
}