import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/7537044.jpg'
import {
    Search,
    Grid,
    ChevronDown,
    Settings,
    Share2,
    Maximize2,
    MoreHorizontal,
    Plus,
    Star,
    CloudLightningIcon,
    Bell,
    HelpCircle,
} from 'lucide-react';
import {
    Typography,
    Button,
    Input,
    Checkbox,
    Card,
    CardHeader,
    CardBody,
    IconButton,
} from "@material-tailwind/react";
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import Navigation from '../navigation/navigation';

export default function KanbanProject() {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Your work');
    const [activeSubItem, setActiveSubItem] = useState('Worked on');
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const [isCreatingIssue, setIsCreatingIssue] = useState({
        todo: false,
        inProgress: false,
        done: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const createIssueRefs = {
        todo: useRef(null),
        inProgress: useRef(null),
        done: useRef(null)
    };

    const handleCreateClick = (column) => {
        setIsCreatingIssue(prev => ({ ...prev, [column]: true }));
        if (column !== 'todo') {
            setHoveredColumn(null);
        }
    };

    const handleCreateSubmit = (column) => {
        setIsCreatingIssue(prev => ({ ...prev, [column]: false }));
        // Handle issue creation logic here
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProjectsOpen(false);
            }

            // Check if click is outside of any create issue form
            Object.keys(createIssueRefs).forEach(column => {
                if (createIssueRefs[column].current && !createIssueRefs[column].current.contains(event.target)) {
                    setIsCreatingIssue(prev => ({ ...prev, [column]: false }));
                }
            });
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const handleSubItemClick = (subItemName) => {
        setActiveSubItem(subItemName);
    }

    const navItems = [
        { name: 'Your work', path: '/jivar/your-work' },
        { name: 'Projects', path: '/jivar/projects' },
        { name: 'Filters', path: '/jivar/filters' },
        { name: 'Dashboards', path: '/jivar/dashboards' },
        { name: 'Teams', path: '/jivar/teams' },
        { name: 'Plans', path: '/jivar/plans' },
        { name: 'Apps', path: '/jivar/apps' },
    ];

    const subNavItems = ['Worked on', 'Viewed', 'Assigned to me', 'Starred'];

    const renderColumn = (title, column, showCheckmark = false) => (
        <div 
            className="w-[300px] bg-gray-100 p-2 py-1 rounded-sm"
            onMouseEnter={() => column !== 'todo' && !isCreatingIssue[column] && setHoveredColumn(column)}
            onMouseLeave={() => column !== 'todo' && !isCreatingIssue[column] && setHoveredColumn(null)}
        >
            <div className="flex w-full justify-between items-center py-1">
                <div className="hover:bg-gray-200 pe-40 rounded-sm space-x-1">
                    <Typography className='font-semibold text-slate-500 text-[10px] py-1 px-1 flex space-x-2'>
                        {title}
                        {showCheckmark && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 30" strokeWidth={1.5} stroke="green" className="size-4 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        )}
                    </Typography>
                </div>
                <div className="hover:bg-gray-200 ">
                    <IconButton variant="text" className="rounded-full flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </IconButton>
                </div>
            </div>
            {(column === 'todo' || hoveredColumn === column || isCreatingIssue[column]) && (
                !isCreatingIssue[column] ? (
                    <Button
                        variant="text"
                        className="flex items-center justify-start gap-1 px-0 hover:bg-gray-200 pe-40 rounded-sm w-full"
                        onClick={() => handleCreateClick(column)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <Typography className='normal-case font-semibold text-sm not-italic'>Create issue</Typography>
                    </Button>
                ) : (
                    <div ref={createIssueRefs[column]} className="p-1 bg-white rounded border border-blue-500 shadow-sm">
                        <Input
                            type="text"
                            placeholder="What needs to be done?"
                            className="!border-0 focus:!border-0 ring-0 focus:ring-0"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <Button
                                size="sm"
                                className="ml-auto bg-blue-500 text-white px-4 py-1 rounded text-sm"
                                onClick={() => handleCreateSubmit(column)}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                )
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navigation/>
            <div className="flex">
                {/* Left Sidebar */}
                <Card className="w-64 h-[calc(100vh-56px)] rounded-none shadow-none">
                    <CardBody className="p-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <img src={logo} alt="Project" className="w-8 h-8 rounded" />
                            <div>
                                <Typography variant="h6" color="blue-gray">Zz</Typography>
                                <Typography variant="small" color="gray">Software project</Typography>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Typography variant="small" color="blue-gray" className="font-medium uppercase tracking-wide mb-2">
                                PLANNING
                            </Typography>
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

                {/* Main Content */}
                <div className="flex-1 overflow-x-auto">
                    <div className="p-6">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Link to="/projects" className="text-blue-500 hover:underline">
                                <Typography variant="small">Projects</Typography>
                            </Link>
                            <Typography variant="small" color="blue-gray">/</Typography>
                            <Typography variant="small" color="blue-gray">Zz</Typography>
                        </div>

                        {/* Board Header */}
                        <div className="flex items-center justify-between mb-6">
                            <Typography variant="h4" color="blue-gray">
                                ZZ2C board
                            </Typography>
                            <div className="flex items-center space-x-2">
                                <IconButton variant="text" size="sm">
                                    <CloudLightningIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" size="sm">
                                    <Star className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" size="sm">
                                    <Share2 className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" size="sm">
                                    <Maximize2 className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" size="sm">
                                    <MoreHorizontal className="h-5 w-5" />
                                </IconButton>
                            </div>
                        </div>

                        {/* Board Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-64">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        icon={<Search className="h-5 w-5 mt-2" />}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <img src={logo} alt="User" className="w-8 h-8 rounded-full" />
                                    <img src={logo} alt="User" className="w-8 h-8 rounded-full" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 ">
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

                        {/* Kanban Board */}
                        <div className='flex space-x-4'>
                            {renderColumn('TO DO', 'todo')}
                            {renderColumn('IN PROGRESS', 'inProgress')}
                            {renderColumn('DONE', 'done', true)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}