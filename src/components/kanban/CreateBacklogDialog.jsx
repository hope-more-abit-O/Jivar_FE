import React from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
  Select,
  Option,
} from "@material-tailwind/react";
import projectAPI from "../../apis/projectApi";
import { useSearchParams } from "react-router-dom";
import BacklogList from "./BacklogList";

CreateBacklogDialog.propTypes = {
  task: PropTypes.object.isRequired,
  assigneeList: PropTypes.array.isRequired,
};

function CreateBacklogDialog({ task, assigneeList }) {
  const [backlogList, setBacklogList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAssignee, setSelectedAssignee] = React.useState("");
  const [content, setContent] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const fetchBacklog = async () => {
      setIsLoading(true);
      try {
        const res = await projectAPI.getBacklog(task.id);
        setIsLoading(false);
        setBacklogList(res);
      } catch (error) {
        console.log("Failed to get backlog: ", error);
      }
    };

    fetchBacklog();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center mt-4">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    console.log("Selected Assignee ID:", selectedAssignee);
    console.log("Content:", content);
    const pjId = searchParams.get("projectId") || 50;
    const request = {
      projectId: pjId,
      content: content,
      taskId: task.id,
      assignee: selectedAssignee,
    };
    try {
      await projectAPI.createBacklog(request);
      console.log("Backlog created");
    } catch (error) {
      console.log("Failed to create: ", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-start items-end">
        <Typography>Task:</Typography>
        <Typography className="font-normal ms-2">{task.title}</Typography>
      </div>
      <div className="flex flex-row gap-x-16 mt-4">
        <form onSubmit={handleSubmit}>
          <Typography>Create backlog</Typography>

          <div className="flex-none">
            <div>
              <Typography className="mt-4 text-sm font-normal">
                Select assignee
              </Typography>
            </div>
            <div class="w-full max-w-sm min-w-[400px] mt-2">
              <div class="relative">
                <select
                  class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select an assignee
                  </option>
                  {assigneeList.map((role, index) => (
                    <option key={index} value={role.accountId}>
                      {role.accountName}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.2"
                  stroke="currentColor"
                  class="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </div>
            <Typography className="mt-6 mb-2 text-sm font-normal">
              Content
            </Typography>
            <div class="relative w-full min-w-[400px]">
              <textarea
                class="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Content
              </label>
            </div>
            <button
              class="mt-2 rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
            >
              Button
            </button>
          </div>
        </form>
        <div className="grow border-l-2 ps-8">
          <BacklogList list={backlogList} />
        </div>
      </div>
    </div>
  );
}

export default CreateBacklogDialog;
