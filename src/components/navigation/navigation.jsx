import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Grid,
  ChevronDown,
  Search,
  Bell,
  HelpCircle,
  Settings,
} from 'lucide-react';

import logo from '../../assets/7537044.jpg';

const navItems = [
  { name: 'Your work' },
  { name: 'Projects' },
  { name: 'Filters' },
  { name: 'Dashboards' },
  { name: 'Teams' },
  { name: 'Apps' },
];

export default function Navigation() {
  const [activeItem, setActiveItem] = useState('');
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProjectsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar className="max-w-full rounded-none px-4 py-2 border-b border-gray-200">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Jira" className="h-8" />
            <Typography variant="h6" color="blue-gray">Jira</Typography>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            item.name === 'Projects' ? (
              <div key={item.name} className="relative" ref={dropdownRef}>
                <Menu open={isProjectsOpen} handler={setIsProjectsOpen}>
                  <MenuHandler>
                    <Button
                      variant="text"
                      className={`flex items-center ${activeItem === item.name
                        ? 'border-b-2 border-[#0052CC] text-[#0052CC]'
                        : 'text-[#42526E] hover:text-[#172B4D]'
                        }`}
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
                        <MenuItem className="flex items-center justify-between hover:bg-gray-50">
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
                      <Typography variant="small" className="font-normal hover:bg-gray-200">
                        View all projects
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/jivar/create-project" className="w-full">
                        <Typography variant="small" className="font-normal hover:bg-gray-200">
                          Create project
                        </Typography>
                      </Link>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ) : (
              <Button
                key={item.name}
                variant="text"
                className={`flex items-center ${activeItem === item.name
                  ? 'border-b-2 border-[#0052CC] text-[#0052CC]'
                  : 'text-[#42526E] hover:text-[#172B4D]'
                  }`}
                onClick={() => handleItemClick(item.name)}
              >
                {item.name}
                {item.name !== 'Your work' && <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
            )
          ))}
          <Button color="blue" size="sm">
            Create
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <IconButton variant="text" className="relative">
            <Bell className="h-5 w-5 text-[#42526E]" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </IconButton>
          <IconButton variant="text">
            <HelpCircle className="h-5 w-5 text-[#42526E]" />
          </IconButton>
          <IconButton variant="text">
            <Settings className="h-5 w-5 text-[#42526E]" />
          </IconButton>
          <Avatar src={logo} alt="Profile" size="xs" />
        </div>
      </div>
    </Navbar>
  );
}