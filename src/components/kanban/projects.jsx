import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/7537044.jpg';
import { Search, ChevronDown, Settings, Share2, Maximize2, MoreHorizontal, Plus, Star, CloudLightning, Bell, HelpCircle, X, MessageSquare } from 'lucide-react';
import {
    Typography,
    Button,
    Input,
    Card,
    CardBody,
    IconButton,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import Navigation from '../navigation/navigation';

export default function KanbanProject() {
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [selectedSprintId, setSelectedSprintId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredColumn, setHoveredColumn] = useState(null);
    const [isSprintDialogOpen, setIsSprintDialogOpen] = useState(false);
    const [newSprintData, setNewSprintData] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });
    const [isCreatingIssue, setIsCreatingIssue] = useState({
        todo: false,
        inProgress: false,
        done: false
    });
    const handleCreateSprintClick = () => {
        setIsSprintDialogOpen(true);
    };

    const handleSprintDialogClose = () => {
        setIsSprintDialogOpen(false);
        setNewSprintData({ name: '', startDate: '', endDate: '' });
    };
    const [newIssueText, setNewIssueText] = useState({
        todo: '',
        inProgress: '',
        done: ''
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [newComment, setNewComment] = useState('');
    const createIssueRefs = useRef({
        todo: null,
        inProgress: null,
        done: null
    });
    const commentInputRef = useRef(null);
    const { projectId } = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://192.168.2.223:5002/api/Project/${projectId}?includeRole=true&includeSprint=true&includeTask=true`);
                if (response.data) {
                    const data = response.data;
                    console.log('API Response:', response.data);


                    setProject({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        create_by: {
                            account_id: data.createBy?.id,
                            username: data.createBy?.name,
                        },
                        create_time: data.createTime,
                        complete_time: data.completeTime,
                        budget: data.budget,
                        status: data.status,
                        project_roles: data.roles.map((role) => ({
                            account_id: role.accountId,
                            username: role.accountName,
                            role: role.role,
                        })),
                        sprints: (data.sprints || []).map((sprint) => ({
                            id: sprint.id,
                            name: sprint.name,
                            start_date: sprint.startDate,
                            end_date: sprint.endDate,
                            tasks: (sprint.tasks || []).map((task) => ({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                create_by: task.createBy,
                                create_time: task.createTime,
                                assign_by: task.assignBy,
                                assignee: task.assignee,
                                complete_time: task.completeTime,
                                status: task.status,
                                task_document: task.documentId
                                    ? [
                                        {
                                            document_id: task.documentId,
                                            name: `Document ${task.documentId}`,
                                            file_path: `/files/doc${task.documentId}.pdf`,
                                        },
                                    ]
                                    : [],
                                sub_tasks: [],
                                comments: [],
                            })),
                        })),
                    });
                } else {
                    setError('Project not found.');
                }
            } catch (err) {
                setError('Failed to load project.', err);
                setError(err.message || 'An error occurred');
                console.log(err)
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

    useEffect(() => {
        function handleClickOutside(event) {
            Object.keys(createIssueRefs.current).forEach(column => {
                if (createIssueRefs.current[column] &&
                    !createIssueRefs.current[column].contains(event.target) &&
                    !event.target.closest('button')?.contains(createIssueRefs.current[column])) {
                    setIsCreatingIssue(prev => ({ ...prev, [column]: false }));
                }
            });
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCreateSprintToggle = () => {
        setIsCreatingSprint(!isCreatingSprint);
    };

    const handleCreateSprintChange = (e) => {
        const { name, value } = e.target;
        setNewSprint((prev) => ({ ...prev, [name]: value }));
    };


    const handleCreateSprintSubmit = async () => {
        try {
            await axios.post(`http://192.168.2.223:5002/api/v1/sprint?projectId=${projectId}`, newSprintData);
            setIsSprintDialogOpen(false);
            setNewSprintData({ name: '', startDate: '', endDate: '' });
            const response = await axios.get(`http://192.168.2.223:5002/api/Project/${projectId}?includeRole=true&includeSprint=true&includeTask=true`);
            setProject({
                ...response.data,
                sprints: response.data.sprints.map((sprint) => ({
                    ...sprint,
                    tasks: sprint.tasks || []
                }))
            });
        } catch (error) {
            console.error('Failed to create sprint:', error);
            setError('Failed to create sprint. Please try again.');
        }
    };

    const handleSprintDialogOpen = () => {
        setIsSprintDialogOpen(true);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === 'm' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                commentInputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    const toggleShowAllMembers = () => {
        setShowAllMembers(!showAllMembers);
    };

    const handleSprintClick = (sprintId) => {
        setSelectedSprintId(sprintId);
    };

    const handleBackToSprints = () => {
        setSelectedSprintId(null);
    };

    const handleCreateClick = (column) => {
        setIsCreatingIssue(prev => ({ ...prev, [column]: true }));
    };

    const handleCreateSubmit = (column) => {
        if (newIssueText[column].trim() !== '') {
            const newTask = {
                id: Date.now(),
                title: newIssueText[column],
                description: '',
                status: column.toUpperCase()
            };

            setProject(prevProject => {
                const updatedSprints = prevProject.sprints.map(sprint => {
                    if (sprint.id === selectedSprintId) {
                        return {
                            ...sprint,
                            tasks: [...sprint.tasks, newTask]
                        };
                    }
                    return sprint;
                });

                return {
                    ...prevProject,
                    sprints: updatedSprints
                };
            });

            setNewIssueText(prev => ({ ...prev, [column]: '' }));
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDialogOpen(true);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`http://localhost:8008/task/${selectedTask.id}/comments`, {
                content: newComment,
                create_by: currentUser.id,
            });

            if (response.status !== 200) throw new Error('Failed to add comment');

            const updatedTask = {
                ...selectedTask,
                comments: [
                    ...selectedTask.comments,
                    {
                        id: Date.now(),
                        content: newComment,
                        create_by: currentUser.id,
                        created_at: new Date().toISOString(),
                    },
                ],
            };
            setSelectedTask(updatedTask);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const renderSprintGrid = () => {
        if (!project.sprints || project.sprints.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-6">
                    <Typography variant="h6" color="gray" className="mb-2">
                        It looks like this project does not have any sprints yet.{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={handleSprintDialogOpen}
                        >
                            Create Sprint
                        </span>
                    </Typography>
                </div>
            );
        }

        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5" color="blue-gray">
                        Sprints
                    </Typography>
                    <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        onClick={handleSprintDialogOpen}
                        className="shadow-md"
                    >
                        Create Sprint
                    </Button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {project.sprints.map((sprint) => (
                        <div
                            key={sprint.id}
                            className="bg-gray-100 p-4 rounded shadow-sm relative cursor-pointer hover:bg-gray-200"
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
            </div>
        );
    };


    const renderTaskDialog = () => {
        const taskCreator = project?.project_roles.find(
            (role) => role.account_id === selectedTask?.create_by
        );
        const taskAssignee = project?.project_roles.find(
            (role) => role.account_id === selectedTask?.assignee
        );
        const taskDocuments = selectedTask?.task_document || [];
        const taskSubTasks = selectedTask?.sub_tasks || [];
        const taskComments = selectedTask?.comments || [];

        const UserAvatar = ({ username, size = "md" }) => {
            const initials = username ? username.substring(0, 2).toUpperCase() : "U";
            const sizeClasses = {
                sm: "w-6 h-6 text-xs",
                md: "w-8 h-8 text-sm",
                lg: "w-10 h-10 text-base"
            };

            return (
                <div className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-medium`}>
                    {initials}
                </div>
            );
        };

        return (
            <>
                <div
                    className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isTaskDialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        } z-50`}
                    onClick={() => setIsTaskDialogOpen(false)}
                />
                <Dialog
                    open={isTaskDialogOpen}
                    handler={() => setIsTaskDialogOpen(false)}
                    size="md"
                    className="fixed top-[56px] left-[500px] -translate-x-1/2 w-[800px] max-w-[calc(100vw-48px)] m-0 p-0 shadow-xl z-[60] max-h-[calc(100vh-80px)] overflow-hidden"
                    animate={{
                        mount: { scale: 1, opacity: 1 },
                        unmount: { scale: 0.9, opacity: 0 },
                    }}
                >
                    <DialogHeader className="flex justify-between items-center border-b p-4">
                        <div className="flex items-center gap-4">
                            <Link to="/jivar/projects" className="text-blue-500 hover:underline">
                                <Typography variant="small">Projects</Typography>
                            </Link>
                            <Typography variant="small" color="blue-gray">/</Typography>
                            <Typography variant="small" color="blue-gray">{project?.name}</Typography>
                            <Typography variant="small" color="blue-gray">/</Typography>
                            <div className="text-sm font-bold">
                                {selectedTask?.title} - {selectedTask?.id}
                            </div>
                        </div>
                        <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => setIsTaskDialogOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="p-4 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="mb-6">
                                    <Typography variant="h5" color="blue-gray" className="mb-2">
                                        {selectedTask?.title}
                                    </Typography>
                                    <Typography color="gray" className="mb-4">
                                        {selectedTask?.description || "No description provided"}
                                    </Typography>
                                </div>
                                <div className="mb-6">
                                    <Typography variant="h6" color="blue-gray" className="mb-2">
                                        Documents
                                    </Typography>
                                    <ul className="list-disc pl-4">
                                        {taskDocuments.map((doc) => (
                                            <li key={doc.document_id}>
                                                <a
                                                    href={doc.file_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {doc.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-6">
                                    <Typography variant="h6" color="blue-gray" className="mb-2">
                                        Subtasks
                                    </Typography>
                                    <ul className="list-disc pl-4">
                                        {taskSubTasks.map((subTask) => (
                                            <li key={subTask.id}>
                                                {subTask.title} -{" "}
                                                <span className="text-gray-500">
                                                    {subTask.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Button
                                            variant="text"
                                            color="blue-gray"
                                            className="flex items-center gap-2 px-3"
                                            size="sm"
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="blue"
                                            className="flex items-center gap-2 px-3"
                                            size="sm"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Comments
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="blue-gray"
                                            className="flex items-center gap-2 px-3"
                                            size="sm"
                                        >
                                            History
                                        </Button>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                                {currentUser?.username.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <Input
                                                ref={commentInputRef}
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="w-full"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleCommentSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {taskComments.map((comment) => {
                                            const commentUser = project?.project_roles.find(
                                                (role) => role.account_id === comment.create_by
                                            );
                                            return (
                                                <div key={comment.id} className="flex gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                                        {commentUser?.username?.substring(0, 2).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <Typography variant="small" className="font-medium">
                                                            {commentUser?.username || 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="small" className="text-gray-700">
                                                            {comment.content}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 border-l-2 pl-3">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Created By
                                    </Typography>
                                    <div className="flex items-center gap-2">
                                        <UserAvatar username={taskCreator?.username} />
                                        <Typography color="gray">
                                            {taskCreator?.username || "Unknown"}
                                        </Typography>
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Assignee
                                    </Typography>
                                    <div className="flex items-center gap-2">
                                        <UserAvatar username={taskAssignee?.username} />
                                        <Typography color="gray">
                                            {taskAssignee?.username || "Unassigned"}
                                        </Typography>
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Status
                                    </Typography>
                                    <Typography color="gray">
                                        {selectedTask?.status || "Unknown"}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="border-t p-4">
                        <div className="flex justify-between w-full">
                            <Button variant="outlined" size="sm" color="blue-gray">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="filled" size="sm" color="blue">
                                Save changes
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </>
        );
    };

    const renderColumn = (title, tasks, column) => (
        <div
            className="w-[300px] bg-gray-100 p-2 py-1 rounded-sm relative"
            onMouseEnter={() => setHoveredColumn(column)}
            onMouseLeave={() => setHoveredColumn(null)}
        >
            <div className="flex w-full justify-between items-center py-1">
                <Typography className="font-semibold text-slate-500 text-[10px] py-1 px-1">
                    {title}
                </Typography>
                <IconButton variant="text" className="rounded-full flex justify-center">
                    <MoreHorizontal className="size-6" />
                </IconButton>
            </div>
            <div>
                {tasks.map((task) => {
                    console.log('task', tasks);
                    const taskAssignee = project?.project_roles.find(
                        (role) => role.account_id === task.assignee
                    );
                    return (
                        <div
                            key={task.id}
                            className="bg-white p-2 my-2 rounded shadow cursor-pointer hover:bg-gray-50"
                            onClick={() => handleTaskClick(task)}
                        >
                            <Typography variant="small" className="font-medium">
                                {task.title}
                            </Typography>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" className="text-gray-500 flex-grow">
                                    {task.description}
                                </Typography>
                                <div className="ml-2 relative group">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                        {taskAssignee?.username ? taskAssignee.username.substring(0, 2).toUpperCase() : 'U'}
                                    </div>
                                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10">
                                        <div className="bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                            Assignee: {taskAssignee?.username || 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {hoveredColumn === column && !isCreatingIssue[column] && (
                    <Button
                        variant="text"
                        className="flex items-center justify-start gap-1 px-0 hover:bg-gray-200 pe-40 rounded-sm w-full"
                        onClick={() => handleCreateClick(column)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <Typography className="normal-case font-semibold text-sm not-italic">Create issue</Typography>
                    </Button>
                )}
                {isCreatingIssue[column] && (
                    <div
                        ref={(el) => (createIssueRefs.current[column] = el)}
                        className="p-2 bg-white rounded border border-blue-500 shadow-sm"
                    >
                        <Input
                            type="text"
                            placeholder="What needs to be done?"
                            value={newIssueText[column]}
                            onChange={(e) => setNewIssueText(prev => ({ ...prev, [column]: e.target.value }))}
                            className="!border-0 focus:!border-0 ring-0 focus:ring-0 text-sm"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
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
                )}
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
                            <Link to="/jivar/projects" className="text-blue-500 hover:underline">
                                <Typography variant="small">Projects</Typography>
                            </Link>
                            <Typography variant="small" color="blue-gray">/</Typography>
                            <Typography variant="small" color="blue-gray">{project.name}</Typography>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-x-1">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pr-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500 h-[2.25rem]"
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
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
                                {project.project_roles && project.project_roles.length > 3 ? (
                                    <div
                                        className="relative flex items-center -ml-2 group cursor-pointer"
                                        onClick={toggleShowAllMembers}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 text-white font-semibold">
                                            +{project.project_roles.length - 3}
                                        </div>
                                        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 text-sm bg-black text-white py-1 px-2 rounded shadow-lg transition-all duration-200 ease-in-out whitespace-nowrap">
                                            Show more members
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="relative flex items-center -ml-2 group cursor-pointer"
                                        onClick={toggleShowAllMembers}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-500 text-white font-semibold">
                                            ...
                                        </div>
                                        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 text-sm bg-black text-white py-1 px-2 rounded shadow-lg transition-all duration-200 ease-in-out whitespace-nowrap">
                                            Show all members
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
                        {!selectedSprintId ? (
                            <div className="p-6">
                                {renderSprintGrid()}
                                <Dialog
                                    open={isSprintDialogOpen}
                                    handler={handleSprintDialogClose}
                                    size="sm"
                                >
                                    <DialogHeader>Create Sprint</DialogHeader>
                                    <DialogBody>
                                        <div className="space-y-4">
                                            <Input
                                                label="Sprint Name"
                                                value={newSprintData.name}
                                                onChange={(e) =>
                                                    setNewSprintData((prev) => ({ ...prev, name: e.target.value }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                label="Start Date"
                                                value={newSprintData.startDate}
                                                onChange={(e) =>
                                                    setNewSprintData((prev) => ({ ...prev, startDate: e.target.value }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                label="End Date"
                                                value={newSprintData.endDate}
                                                onChange={(e) =>
                                                    setNewSprintData((prev) => ({ ...prev, endDate: e.target.value }))
                                                }
                                            />
                                        </div>
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="text"
                                            color="blue-gray"
                                            onClick={handleSprintDialogClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="filled"
                                            color="blue"
                                            onClick={handleCreateSprintSubmit}
                                        >
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </Dialog>
                            </div>
                        ) : (
                            <>
                                <Button
                                    onClick={handleBackToSprints}
                                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Back to Sprints list
                                </Button>
                                <div className="flex space-x-4">
                                    {renderColumn(
                                        'TO DO',
                                        project.sprints.find((s) => s.id === selectedSprintId)?.tasks.filter((task) => task.status === 'TO DO') || [],
                                        'todo'
                                    )}
                                    {renderColumn(
                                        'IN PROGRESS',
                                        project.sprints.find((s) => s.id === selectedSprintId)?.tasks.filter((task) => task.status === 'IN_PROGRESS') || [],
                                        'inProgress'
                                    )}
                                    {renderColumn(
                                        'DONE',
                                        project.sprints.find((s) => s.id === selectedSprintId)?.tasks.filter((task) => task.status === 'DONE') || [],
                                        'done'
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {renderTaskDialog()}
        </div>
    );
}