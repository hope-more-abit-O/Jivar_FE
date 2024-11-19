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
    Textarea,
} from "@material-tailwind/react";
import Cookies from 'js-cookie';
import Navigation from '../navigation/navigation';
import { data } from 'autoprefixer';
import { CheckCircleIcon, ExclamationCircleIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';

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
    const [updateUI, setUpdateUI] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [searchedUser, setSearchedUser] = useState(null);
    const [editableTask, setEditableTask] = useState({});
    const [searchAccountId, setSearchAccountId] = useState('');
    const [role, setRole] = useState('');
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const handleAddUserClick = () => {
        setIsAddUserDialogOpen(true);
    };

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
            Cookies.set('projectId', projectId)
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

    const fetchTaskDetails = async (taskId) => {
        try {
            const response = await axios.get(`http://192.168.2.223:5002/api/v1/task/${taskId}`);
            console.log("API Response:", response.data);
            if (response?.data?.status === 200) {
                const taskData = response.data.data;
                console.log("Task Data:", taskData);
                setEditableTask({
                    id: taskData.id,
                    title: taskData.title,
                    description: taskData.description,
                    createBy: taskData.createBy,
                    assignee: taskData.assignee,
                    documentId: taskData.taskDocuments?.[0]?.document_id || null,
                    startDateSprintTask: taskData.startDateSprintTask,
                    endDateSprintTask: taskData.endDateSprintTask,
                    status: taskData.status,
                });
                setSelectedTask(taskData);
            } else {
                console.error("Error fetching task:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch task details:", error);
        }
    };

    const updateTaskDetails = async () => {
        if (!editableTask.id) {
            console.error("Task ID is missing");
            return;
        }

        try {
            const response = await axios.put(
                `http://192.168.2.223:5002/api/v1/task/${editableTask.id}`,
                editableTask
            );

            if (response.status === 200) {
                alert("Task updated successfully!");

                setProject((prevProject) => {
                    const updatedSprints = prevProject.sprints.map((sprint) => {
                        const updatedTasks = sprint.tasks.map((task) =>
                            task.id === editableTask.id ? { ...task, ...editableTask } : task
                        );
                        return { ...sprint, tasks: updatedTasks };
                    });
                    return { ...prevProject, sprints: updatedSprints };
                });

                setEditableTask((prevTask) => ({
                    ...prevTask,
                    ...editableTask,
                }));

                setIsTaskDialogOpen(false);
            } else {
                console.error("Failed to update task:", response.data.message);
            }
        } catch (error) {
            console.error("Error during task update:", error);
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const response = await axios.put(
                `http://192.168.2.223:5002/api/v1/task/update-status/${taskId}?status=${status}`
            );

            if (response.status === 200) {
                alert(`Task status updated to ${status} successfully!`);
                setProject((prevProject) => {
                    const updatedSprints = prevProject.sprints.map((sprint) => {
                        const updatedTasks = sprint.tasks.map((task) =>
                            task.id === taskId ? { ...task, status } : task
                        );
                        return { ...sprint, tasks: updatedTasks };
                    });
                    return { ...prevProject, sprints: updatedSprints };
                });

                setEditableTask((prevTask) => ({
                    ...prevTask,
                    status,
                }));
            } else {
                console.error("Failed to update task status:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };




    const openTaskDialog = (taskId) => {
        fetchTaskDetails(taskId);
        setIsTaskDialogOpen(true);
    };


    const handleInputChange = (field, value) => {
        setEditableTask((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateSprintToggle = () => {
        setIsCreatingSprint(!isCreatingSprint);
    };

    const handleCreateSprintChange = (e) => {
        const { name, value } = e.target;
        setNewSprint((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchUser = async () => {
        if (!searchAccountId) {
            alert("Please enter an Account ID to search.");
            return;
        }

        setIsLoadingUser(true);

        try {
            const response = await axios.get(`http://192.168.2.223:5002/api/v1/account/info/user/${searchAccountId}`);
            console.log("Search User Response:", response.data);

            if (response.data) {
                setSearchedUser({
                    accountId: response.data.id,
                    name: response.data.name,
                });
            } else {
                alert("User not found.");
            }
        } catch (error) {
            console.error("Error searching user:", error.response || error.message);
            alert("An error occurred while searching for the user.");
        } finally {
            setIsLoadingUser(false);
        }
    };


    const handleAddUserToProject = async () => {
        if (!searchedUser || !role) {
            alert("Please select a user and assign a role before adding to the project.");
            return;
        }

        console.log("Searched User Object:", searchedUser);
        console.log("Account ID:", searchedUser.accountId);

        if (!searchedUser.accountId) {
            alert("Error: Account ID is missing. Please ensure the user is selected correctly.");
            return;
        }

        try {
            const token = Cookies.get('accessToken');
            const payload = {
                accountId: searchedUser.accountId,
                projectId: project.id,
                role: role,
            };

            console.log("Payload being sent:", payload);

            const response = await axios.post(
                'http://192.168.2.223:5002/api/ProjectRole',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response Object:", response);

            if (response.status === 200) {
                setProject((prev) => ({
                    ...prev,
                    project_roles: [
                        ...prev.project_roles,
                        { account_id: searchedUser.accountId, username: searchedUser.name, role },
                    ],
                }));

                alert(`Success: User ${searchedUser.name} has been added to the project as ${role}.`);
                setIsAddUserDialogOpen(false);
            }
        } catch (error) {
            if (error.response) {
                console.error("Error Response:", error.response);
                alert(`Error: ${error.response.data.message || "An unexpected error occurred"}`);
            } else {
                console.error("Network or unknown error:", error.message);
                alert("An error occurred. Please check your network connection or try again later.");
            }
        }
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
            const response2 = await axios.get(`http://192.168.2.223:5002/api/Project/${projectId}?includeRole=true&includeSprint=true&includeTask=true`);
            setProject(response2.data);
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
        console.log('Toggling showAllMembers:', !showAllMembers);
        setShowAllMembers(!showAllMembers);
    };

    const handleSprintClick = (sprintId) => {
        console.log("Sprint ID clicked:", sprintId);
        setSelectedSprintId(sprintId);
    };

    const handleUpdateRole = async (accountId, newRole) => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.put(
                'http://192.168.2.223:5002/api/ProjectRole',
                {
                    accountId,
                    projectId: project.id,
                    role: newRole,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alert('Role updated successfully.');
                setProject((prev) => ({
                    ...prev,
                    project_roles: prev.project_roles.map((role) =>
                        role.account_id === accountId ? { ...role, role: newRole } : role
                    ),
                }));
            }
        } catch (error) {
            console.error('Error updating role:', error.response || error.message);
            alert('Failed to update role. Please try again.');
        }
    };

    const handleRemoveMember = async (accountId) => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.delete(
                `http://192.168.2.223:5002/api/ProjectRole/${project.id}/${accountId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alert('Member removed successfully.');
                setProject((prev) => ({
                    ...prev,
                    project_roles: prev.project_roles.filter((role) => role.account_id !== accountId),
                }));
            }
        } catch (error) {
            console.error('Error removing member:', error.response || error.message);
            alert('Failed to remove member. Please try again.');
        }
    };

    const renderAllMembers = () => {
        const userId = Cookies.get('userId');
        const currentUser = project.project_roles.find(
            (role) => String(role.account_id) === userId
        );

        console.log('Current User:', currentUser);

        const uniqueRoles = Array.from(
            new Map(project.project_roles.map((role) => [role.account_id, role])).values()
        );

        console.log('Unique Roles:', uniqueRoles);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-[400px] rounded-lg p-6 shadow-lg relative">
                    <button
                        onClick={toggleShowAllMembers}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                        &times;
                    </button>
                    <h2 className="text-lg font-semibold mb-3">All Members</h2>
                    <ul className="space-y-4">
                        {uniqueRoles.map((role) => (
                            <li
                                key={role.account_id}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">
                                        {role.username?.substring(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <Typography variant="small" className="font-medium">
                                            {role.username}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                            Role: {role.role}
                                        </Typography>
                                    </div>
                                </div>
                                {currentUser?.role === 'Owner' && role.role !== 'Owner' && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="border rounded px-2 py-1 text-sm"
                                            value={role.role}
                                            onChange={(e) => handleUpdateRole(role.account_id, e.target.value)}
                                        >
                                            <option value="Developer">Developer</option>
                                            <option value="Tester">Tester</option>
                                            <option value="Manager">Manager</option>
                                        </select>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveMember(role.account_id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    const handleBackToSprints = () => {
        setSelectedSprintId(null);
    };

    const handleCreateClick = (column) => {
        setIsCreatingIssue(prev => ({ ...prev, [column]: true }));
    };

    const handleCreateTask = async (sprintId, title, column) => {
        console.log('Creating task for Sprint ID:', sprintId, 'with title:', title, 'in column:', column);
        try {
            const accessToken = Cookies.get('accessToken');

            const createResponse = await axios.post(
                `http://192.168.2.223:5002/api/v1/task?sprintId=${sprintId}`,
                {
                    title: title,
                    description: null,
                    assignBy: null,
                    assignee: null,
                    documentId: null,
                    startDateSprintTask: null,
                    endDateSprintTask: null
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (createResponse.data.status === 200) {
                const createdTask = createResponse.data.data;
                console.log('Task created successfully:', createdTask);

                const statusMap = {
                    todo: 'TO_DO',
                    inProgress: 'IN_PROGRESS',
                    done: 'DONE'
                };

                const status = statusMap[column];
                if (status) {
                    await axios.put(
                        `http://192.168.2.223:5002/api/v1/task/update-status/${createdTask.id}?status=${status}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log(`Task status updated to ${status}`);
                }

                const fetchResponse = await axios.get(
                    `http://192.168.2.223:5002/api/v1/task/${createdTask.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const updatedTask = fetchResponse.data;
                console.log('Fetched updated task:', updatedTask);

                setProject((prevProject) => ({
                    ...prevProject,
                    sprints: prevProject.sprints.map((sprint) => {
                        if (sprint.id === sprintId) {
                            return {
                                ...sprint,
                                tasks: [...sprint.tasks, updatedTask],
                            };
                        }
                        return sprint;
                    }),
                }));
                localStorage.setItem('selectedSprintId', sprintId);

                window.location.reload();

            } else {
                console.error('Task creation failed:', createResponse.data.message);
            }
        } catch (error) {
            console.error('Error creating or updating task:', error.response?.data || error.message);
        }
    };


    const handleCreateSubmit = (column) => {
        const sprint = project.sprints.find((s) => s.id === selectedSprintId);

        if (newIssueText[column].trim() !== '' && sprint) {
            const title = newIssueText[column].trim();

            handleCreateTask(sprint.id, title, column);

            setNewIssueText((prev) => ({ ...prev, [column]: '' }));
        }
    };

    const handleTaskClick = (task) => {
        console.log("Clicked Task Object:", task);
        fetchTaskDetails(task.id);
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
            (role) => role.account_id === editableTask?.createBy
        );
        const taskAssignee = project?.project_roles.find(
            (role) => role.account_id === editableTask?.assignee
        );

        const userId = Cookies.get('userId');
        const currentUser = project?.project_roles.find(
            (role) => String(role.account_id) === userId
        );

        const canEditAssignee =
            currentUser?.role === 'Owner' || currentUser?.role === 'Manager';

        const UserAvatar = ({ username, size = "md" }) => {
            const initials = username ? username.substring(0, 2).toUpperCase() : "U";
            const sizeClasses = {
                sm: "w-6 h-6 text-xs",
                md: "w-8 h-8 text-sm",
                lg: "w-10 h-10 text-base",
            };

            return (
                <div
                    className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-medium`}
                >
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
                            <Typography variant="small" color="blue-gray">
                                /
                            </Typography>
                            <Typography variant="small" color="blue-gray">
                                {project?.name}
                            </Typography>
                            <Typography variant="small" color="blue-gray">
                                /
                            </Typography>
                            <div className="text-sm font-bold">
                                {editableTask?.title} - {editableTask?.id}
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
                                        <input
                                            type="text"
                                            value={editableTask?.title || ""}
                                            placeholder="Title"
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    </Typography>
                                    <textarea
                                        value={editableTask?.description || ""}
                                        placeholder="Description"
                                        onChange={(e) =>
                                            handleInputChange("description", e.target.value)
                                        }
                                        className="w-full border rounded p-2"
                                        rows={3}
                                    />
                                </div>
                                <div className="mb-6">
                                    <Typography variant="h6" color="blue-gray" className="mb-2">
                                        Start Date
                                    </Typography>
                                    <input
                                        type="datetime-local"
                                        value={editableTask?.startDateSprintTask || ""}
                                        onChange={(e) =>
                                            handleInputChange("startDateSprintTask", e.target.value)
                                        }
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div className="mb-6">
                                    <Typography variant="h6" color="blue-gray" className="mb-2">
                                        End Date
                                    </Typography>
                                    <input
                                        type="datetime-local"
                                        value={editableTask?.endDateSprintTask || ""}
                                        onChange={(e) =>
                                            handleInputChange("endDateSprintTask", e.target.value)
                                        }
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            </div>

                            {/* Các trường chỉnh sửa Assign By và Assignee */}
                            <div className="space-y-6 border-l-2 pl-3">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Assign By
                                    </Typography>
                                    <input
                                        type="text"
                                        value={editableTask?.assignBy || currentUser?.username || ""}
                                        placeholder="Assign By"
                                        readOnly
                                        className="w-full border rounded p-2 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Assignee
                                    </Typography>
                                    {canEditAssignee ? (
                                        <select
                                            value={editableTask?.assignee || ""}
                                            onChange={(e) => handleInputChange("assignee", e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">Select Assignee</option>
                                            {project?.project_roles.map((role) => (
                                                <option key={role.account_id} value={role.account_id}>
                                                    {role.username}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={taskAssignee?.username || "Unassigned"}
                                            readOnly
                                            className="w-full border rounded p-2 bg-gray-100"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Current Status
                                    </Typography>
                                    <div
                                        className={`px-4 py-2 rounded text-white ${editableTask?.status === "TO_DO"
                                            ? "bg-black"
                                            : editableTask?.status === "IN_PROGRESS"
                                                ? "bg-red-500"
                                                : editableTask?.status === "DONE"
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`}
                                    >
                                        {editableTask?.status || "No Status"}
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                        Update Status
                                    </Typography>
                                    <select
                                        value={editableTask?.status || "TO_DO"}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            updateTaskStatus(editableTask?.id, newStatus);
                                        }}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="TO_DO">TO_DO</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="border-t p-4">
                        <div className="flex justify-between w-full">
                            <Button
                                variant="filled"
                                size="sm"
                                color="blue"
                                onClick={updateTaskDetails}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </>
        );
    };

    const renderAddUserDialog = () => (
        <Dialog
            open={isAddUserDialogOpen}
            handler={() => setIsAddUserDialogOpen(false)}
            size="sm"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <DialogHeader>
                    <Typography variant="h5" className="font-bold text-blue-gray-800">
                        Add User to Project
                    </Typography>
                </DialogHeader>
                <DialogBody className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Account ID
                        </Typography>
                        <Input
                            label="Enter Account ID"
                            value={searchAccountId}
                            onChange={(e) => setSearchAccountId(e.target.value)}
                            placeholder="Enter the user’s account ID"
                            icon={<UsersIcon className="h-5 w-5 text-blue-gray-400" />}
                        />
                        <Button
                            color="blue"
                            className="mt-2 flex items-center gap-2"
                            onClick={handleSearchUser}
                            disabled={isLoadingUser}
                        >
                            {isLoadingUser ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        ></path>
                                    </svg>
                                    Searching...
                                </>
                            ) : (
                                'Search User'
                            )}
                        </Button>
                    </div>

                    {searchedUser ? (
                        <div className="bg-blue-gray-50 p-4 rounded-md shadow">
                            <div className="flex items-center gap-4">
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                <Typography variant="h6" className="font-semibold">
                                    {searchedUser.name || 'Unknown'}
                                </Typography>
                            </div>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="mt-1 flex items-center gap-2"
                            >
                                <UserIcon className="h-5 w-5 text-blue-gray-400" />
                                Account ID: {searchedUser.accountId || 'N/A'}
                            </Typography>
                            <div className="mt-4 flex flex-col gap-2">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                    Role
                                </Typography>
                                <Input
                                    label="Assign Role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="Enter Role (e.g., Developer)"
                                />
                            </div>
                        </div>
                    ) : (
                        searchAccountId &&
                        !isLoadingUser && (
                            <div className="mt-4 flex items-center gap-4">
                                <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                                <Typography variant="small" color="red">
                                    User not found. Please check the Account ID.
                                </Typography>
                            </div>
                        )
                    )}
                </DialogBody>
                <DialogFooter className="flex justify-end gap-4">
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setIsAddUserDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        color="blue"
                        onClick={handleAddUserToProject}
                        disabled={!searchedUser || !role}
                        className="flex items-center gap-2"
                    >
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                        Add User
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );

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
                    const taskAssignee = project?.project_roles.find(
                        (role) => role.account_id === task.assignee
                    );

                    return (
                        <div
                            key={`${task.id}-${task.status}`} // Include `status` in key for dynamic updates
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
                                        {taskAssignee?.username
                                            ? taskAssignee.username.substring(0, 2).toUpperCase()
                                            : 'U'}
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        <Typography className="normal-case font-semibold text-sm not-italic">
                            Create issue
                        </Typography>
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
                            onChange={(e) =>
                                setNewIssueText((prev) => ({
                                    ...prev,
                                    [column]: e.target.value,
                                }))
                            }
                            className="!border-0 focus:!border-0 ring-0 focus:ring-0 text-sm"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{
                                className: "min-w-0",
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCreateSubmit(column);
                                }
                            }}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4 text-blue-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
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
                                        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 text-sm bg-black text-white py-1 px-2 rounded shadow-lg transition-all duration-200 ease-in-out z-50">
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
                                {showAllMembers && renderAllMembers()}


                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer ml-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 text-black"
                                        onClick={() => setIsAddUserDialogOpen(true)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                                        />
                                    </svg>
                                    {renderAddUserDialog()}
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

                        {showAllMembers && renderAllMembers(
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
                                <div className="flex space-x-4" key={updateUI}>
                                    {renderColumn(
                                        'TO DO',
                                        project.sprints.find((s) => s.id === selectedSprintId)?.tasks.filter((task) => task.status === 'TO_DO') || [],
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