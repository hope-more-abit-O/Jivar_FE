import React, { useState, useEffect, useRef } from "react";
import { Alert } from "@material-tailwind/react";
import { Transition } from "@headlessui/react";
import Navigation from "./navigation/navigation";
import axios from "axios";

export default function YourWork() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState("Worked on"); // Default tab
  const [projects, setProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const dropdownRef = useRef(null);

  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5287/api/Project?includeRole=true&includeSprint=true&includeTask=true"
        );
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Success message handler
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubItemClick = (subItemName) => {
    setActiveSubItem(subItemName);
  };

  // Filter tasks for "Assigned to me"
  const assignedTasks = projects.flatMap((project) =>
    project.sprints?.flatMap((sprint) =>
      sprint.tasks?.filter((task) => task.assignee === "currentUserId") || []
    ) || []
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Success message */}
      {successMessage && (
        <Transition
          show={!!successMessage}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Alert
            color="green"
            className="fixed top-5 right-5 z-50 w-[300px] shadow-lg font-medium border-[#2ec946] bg-[#2ec946]/10 text-[#2ec946]"
          >
            {successMessage}
          </Alert>
        </Transition>
      )}

      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-semibold text-[#172B4D] mb-6">Your work</h1>

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {["Worked on", "Assigned to me"].map((item) => (
              <button
                key={item}
                className={`pb-2 ${
                  activeSubItem === item
                    ? "border-b-2 border-[#0052CC] text-[#0052CC]"
                    : "text-[#42526E] hover:text-[#172B4D]"
                }`}
                onClick={() => handleSubItemClick(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {activeSubItem === "Worked on" && (
          <div>
            <h2 className="text-lg font-semibold text-[#172B4D] mb-4">
              All Projects
            </h2>
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="mb-8">
                  <h3 className="text-md font-bold text-[#0052CC]">
                    {project.name}
                  </h3>
                  {project.sprints?.map((sprint) => (
                    <div key={sprint.id} className="mt-4">
                      <h4 className="font-medium text-[#42526E]">
                        Sprint: {sprint.name}
                      </h4>
                      <ul>
                        {sprint.tasks?.map((task) => (
                          <li
                            key={task.id}
                            className="py-2 px-4 bg-gray-100 rounded-lg my-2"
                          >
                            <div className="flex justify-between items-center">
                              <span>{task.title}</span>
                              <span
                                className={`py-1 px-3 rounded-full text-sm ${
                                  task.status === "In Progress"
                                    ? "bg-yellow-200 text-yellow-600"
                                    : "bg-green-200 text-green-600"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        )}

        {activeSubItem === "Assigned to me" && (
          <div>
            <h2 className="text-lg font-semibold text-[#172B4D] mb-4">
              Tasks Assigned to Me
            </h2>
            {assignedTasks.length > 0 ? (
              assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="py-2 px-4 bg-gray-100 rounded-lg my-2"
                >
                  <div className="flex justify-between items-center">
                    <span>{task.title}</span>
                    <span
                      className={`py-1 px-3 rounded-full text-sm ${
                        task.status === "In Progress"
                          ? "bg-yellow-200 text-yellow-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks assigned to you.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
