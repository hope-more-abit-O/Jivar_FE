import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/7537044.jpg';
import {
    Search,
    Bell,
    HelpCircle,
    Settings,
    ChevronDown,
    Grid,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import Navigation from './navigation/navigation';


export default function YourWork() {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Your work');
    const [activeSubItem, setActiveSubItem] = useState('Worked on');
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProjectsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const handleSubItemClick = (subItemName) =>{
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

    return (
        <div className="min-h-screen bg-white">
                <Navigation/>

            <main className="max-w-7xl mx-auto px-6 py-6">
                <h1 className="text-2xl font-semibold text-[#172B4D] mb-6">Your work</h1>

                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex space-x-8">
                        {subNavItems.map((item) => (
                            <button
                                key={item}
                                className={`pb-2 ${activeSubItem === item
                                        ? 'border-b-2 border-[#0052CC] text-[#0052CC]'
                                        : 'text-[#42526E] hover:text-[#172B4D]'
                                    }`}
                                onClick={() => handleSubItemClick(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="text-center py-16">
                    <img
                        src={logo}
                        alt="No work yet"
                        className="mx-auto mb-6 h-20"
                    />
                    <h2 className="text-xl font-semibold text-[#172B4D] mb-2">
                        You haven't worked on anything yet
                    </h2>
                    <p className="text-[#42526E] mb-6 max-w-md mx-auto">
                        In this page, you'll find your recently worked on issues. Get started by
                        finding the project your team is working on.
                    </p>
                    <button className="px-4 py-2 bg-[#0052CC] text-white rounded hover:bg-[#0747A6]">
                        View all projects
                    </button>
                </div>
            </main>
        </div>
    );
}