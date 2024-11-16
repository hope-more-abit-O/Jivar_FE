import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/7537044.jpg';
import {
    Search,
    ChevronDown,
    Settings,
    Share2,
    Maximize2,
    MoreHorizontal,
    CloudLightningIcon,
    Star,
} from 'lucide-react';
import {
    Typography,
    Button,
    Input,
    Card,
    CardBody,
    IconButton,
} from "@material-tailwind/react";
import Navigation from '../navigation/navigation';

export default function KanbanProject() {
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [selectedSprintId, setSelectedSprintId] = useState(null); // Track selected sprint ID
    const { projectId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:8008/project?id=${projectId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.length > 0) {
                    const activeSprints = data[0].sprints.filter(sprint => sprint.status === "ACTIVE");
                    setProject({ ...data[0], sprints: activeSprints });
                } else {
                    setError('Project not found.');
                }
            } catch (err) {
                setError('Failed to load project.');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        } else {
            setError('Invalid project ID.');
            setLoading(false);
        }
    }, [projectId]);

    const toggleShowAllMembers = () => {
        setShowAllMembers(!showAllMembers);
    };

    const handleSprintClick = (sprintId) => {
        setSelectedSprintId(sprintId);
    };

    const handleBackToSprints = () => {
        setSelectedSprintId(null);
    };

    const renderSprintGrid = () => (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {project.sprints && project.sprints.map((sprint) => (
                <div
                    key={sprint.id}
                    className="bg-gray-100 p-4 rounded shadow-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSprintClick(sprint.id)}
                >
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                        Sprint: {sprint.name}
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                        Start: {new Date(sprint.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="small" color="gray">
                        End: {new Date(sprint.end_date).toLocaleDateString()}
                    </Typography>
                </div>
            ))}
        </div>
    );

    const renderColumn = (title, tasks) => (
        <div className="w-[300px] bg-gray-100 p-2 py-1 rounded-sm">
            <div className="flex w-full justify-between items-center py-1">
                <Typography className="font-semibold text-slate-500 text-[10px] py-1 px-1">
                    {title}
                </Typography>
                <IconButton variant="text" className="rounded-full flex justify-center">
                    <MoreHorizontal className="size-6" />
                </IconButton>
            </div>
            <div>
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white p-2 my-2 rounded shadow">
                        <Typography variant="small" className="font-medium">
                            {task.title}
                        </Typography>
                        <Typography variant="small" className="text-gray-500">
                            {task.description}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );

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
        <div className="min-h-screen bg-white">
            <Navigation />
            <div className="flex">
                <Card className="w-64 h-[calc(100vh-56px)] rounded-none shadow-none">
                    <CardBody className="p-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <img src={logo} alt="Project" className="w-8 h-8 rounded" />
                            <div>
                                <Typography variant="h6" color="blue-gray">{project.name}</Typography>
                                <Typography variant="small" color="gray">{project.description}</Typography>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="border-t-2">
                                <Typography variant="small" color="blue-gray" className="font-bold uppercase tracking-wide mb-2 mt-2">
                                    PLANNING
                                </Typography>
                            </div>
                            <Button variant="text" color="blue-gray" className="flex items-center justify-start normal-case" fullWidth>
                                <span className="mr-3">📅</span>
                                Timeline
                            </Button>
                            <Button variant="text" color="blue" className="flex items-center justify-start normal-case bg-blue-50" fullWidth>
                                <span className="mr-3">📋</span>
                                Board
                            </Button>
                            <Button variant="text" color="blue-gray" className="flex items-center justify-start normal-case" fullWidth>
                                <span className="mr-3">📝</span>
                                List
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex-1 overflow-x-auto">
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Link to="/projects" className="text-blue-500 hover:underline">
                                <Typography variant="small">Projects</Typography>
                            </Link>
                            <Typography variant="small" color="blue-gray">/</Typography>
                            <Typography variant="small" color="blue-gray">{project.name}</Typography>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pr-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
                                <div className="flex items-center w-[300px]">
                                    {project.project_roles?.slice(0, 3).map((role, index) => (
                                        <div
                                            key={role.account_id}
                                            className={`relative flex items-center ${index !== 0 ? '-ml-2' : ''} group`}
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white font-semibold group-hover:w-10 group-hover:h-10 group-hover:border-2 group-hover:border-white transition-all duration-200 ease-in-out">
                                                {role.username ? role.username.substring(0, 2).toUpperCase() : 'U'}
                                            </div>
                                            <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 text-sm bg-black text-white py-1 px-2 rounded shadow-lg transition-all duration-200 ease-in-out">
                                                {role.username || 'Unknown'}
                                            </div>
                                        </div>
                                    ))}
                                    {project.project_roles && project.project_roles.length > 3 && (
                                        <div className="relative flex items-center -ml-2 group cursor-pointer" onClick={toggleShowAllMembers}>
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 text-white font-semibold">
                                                +{project.project_roles.length - 3}
                                            </div>
                                            <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 text-sm bg-black text-white py-1 px-2 rounded shadow-lg transition-all duration-200 ease-in-out whitespace-nowrap">
                                                Show more members
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer ml-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-black"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {showAllMembers && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white w-[300px] rounded-lg p-4 shadow-lg relative">
                                            <button onClick={toggleShowAllMembers} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">&times;</button>
                                            <h2 className="text-lg font-semibold mb-3">All Members</h2>
                                            <ul>
                                                {project.project_roles.map((role) => (
                                                    <li key={role.account_id} className="flex items-center py-1">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white font-semibold mr-2">
                                                            {role.username ? role.username.substring(0, 2).toUpperCase() : 'U'}
                                                        </div>
                                                        <span className="text-gray-700">{role.username || 'Unknown'} - {role.role}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end ">
                                <div className="flex items-center space-x-2 ">
                                    <Typography className='font-semibold text-slate-500 text-[10px] py-1 px-1'>GROUP BY</Typography>
                                    <Button variant="outlined" size="sm" className="normal-case pe-3 flex" color="blue-gray">
                                        None
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                                <Button variant="text" size="sm" className="normal-case flex items-center" color="blue">
                                    <Search className="h-4 w-4 mr-1" />
                                    Insights
                                </Button>
                                <Button variant="text" size="sm" className="normal-case flex items-center" color="blue-gray">
                                    <Settings className="h-4 w-4 mr-1" />
                                    View settings
                                </Button>
                            </div>
                        </div>

                        {!selectedSprintId ? (
                            renderSprintGrid()
                        ) : (
                            <>
                                <Button
                                    onClick={handleBackToSprints}
                                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Back to Sprints list
                                </Button>
                                <div className="flex space-x-4">
                                    {renderColumn('TO DO', project.sprints.find(s => s.id === selectedSprintId)?.tasks.filter(task => task.status === 'TO DO') || [])}
                                    {renderColumn('IN PROGRESS', project.sprints.find(s => s.id === selectedSprintId)?.tasks.filter(task => task.status === 'IN PROGRESS') || [])}
                                    {renderColumn('DONE', project.sprints.find(s => s.id === selectedSprintId)?.tasks.filter(task => task.status === 'DONE') || [])}
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
