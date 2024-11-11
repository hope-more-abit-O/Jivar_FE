import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import logo from '../assets/7537044.jpg'


export default function JivarCreateProject() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will take the user back to the previous page in the history
    };
    const [formData, setFormData] = useState({
        name: '',
        key: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        key: ''
    });

    const [touched, setTouched] = useState({
        name: false,
        key: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));

        validateField(field, formData[field]);
    };

    const validateField = (field, value) => {
        let error = '';

        if (!value.trim()) {
            error = field === 'name'
                ? 'Your project must have a name'
                : 'Your project must have a key';
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        return !error;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameValid = validateField('name', formData.name);
        const keyValid = validateField('key', formData.key);

        setTouched({
            name: true,
            key: true
        });

        if (nameValid && keyValid) {
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
                <Button
                    variant="text"
                    className="flex items-center text-[#42526E] hover:text-[#172B4D] normal-case px-0 text-base"
                    onClick={handleGoBack}
                    
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to previous page
                </Button>
            </div>

            {/* Main Content */}
            <div className="max-w-screen-xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Left Section - Form */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-[#172B4D] mb-4">
                            Add project details
                        </h1>
                        <p className="text-[#42526E] mb-2">
                            Explore what's possible when you collaborate with your team.
                            <br />
                            Edit project details anytime in project settings.
                        </p>
                        <p className="text-sm text-[#42526E] mb-6">
                            Required fields are marked with an asterisk <span className="text-red-500">*</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#172B4D] mb-1">
                                    Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Try a team name, project goal, milestone..."
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {touched.name && errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="key" className="block text-sm font-medium text-[#172B4D] mb-1">
                                    Key<span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="key"
                                    name="key"
                                    type="text"
                                    value={formData.key}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('key')}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.key && errors.key ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {touched.key && errors.key && (
                                    <p className="mt-1 text-sm text-red-500">{errors.key}</p>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="w-[400px]">
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-sm font-medium text-[#172B4D]">Template</h2>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-white rounded-md">
                                <img
                                    src={logo}
                                    alt="Kanban"
                                    className="w-10 h-10"
                                />
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium text-[#172B4D]">Kanban</h3>
                                        <img
                                            src={logo}
                                            alt="Jira"
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-[#42526E]">Jira</span>
                                    </div>
                                    <p className="text-sm text-[#42526E]">
                                        Visualize and advance your project forward using issues on a powerful board.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-sm font-medium text-[#172B4D]">Type</h2>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-white rounded-md">
                                <img
                                    src={logo}
                                    alt="Team-managed"
                                    className="w-10 h-10"
                                />
                                <div>
                                    <h3 className="font-medium text-[#172B4D] mb-1">Team-managed</h3>
                                    <p className="text-sm text-[#42526E]">
                                        Control your own working processes and practices in a self-contained space.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-8 border-t border-gray-200">
                    <Link
                        to="/jivar/your-work"
                        className="px-4 py-2 text-[#42526E] hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#0052CC] text-white rounded hover:bg-[#0747A6]"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}