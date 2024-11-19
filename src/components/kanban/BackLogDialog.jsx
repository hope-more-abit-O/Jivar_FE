import {
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import projectAPI from "../../apis/projectApi";
import CreateBacklogDialog from "./CreateBacklogDialog";
import Cookies from "js-cookie";

function BackLogDialog() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [project, setProject] = React.useState(null);
  const [taskSelected, setTaskSelected] = React.useState(null);
  const [assigneeList, setAssigneeList] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProject = async () => {
      const projectId = searchParams.get("projectId") || 50;
      setIsLoading(true);
      try {
        const res = await projectAPI.getAll(projectId);
        setProject(res);
        setAssigneeList(res.roles);
        setIsLoading(false);
        console.log(res);
      } catch (error) {
        console.log("Failed to get project: ", error);
      }
    };

    fetchProject();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="mt-8 w-full h-80 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-24 py-8">
      <div className="flex flex-row justify-start items-center gap-x-4">
        <IconButton
          variant="outlined"
          className="rounded-full"
          onClick={() => {
            const id = Cookies.get("projectId");
            navigate(`/jivar/project/${id}/board`);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </IconButton>
        <Typography className="font-medium">Back to Sprint page</Typography>
      </div>

      <Breadcrumbs>
        <Typography className="opacity-60 me-3">{project.name}</Typography>

        <Typography className="ms-3">{project.sprints[0].name}</Typography>
      </Breadcrumbs>

      <div class="grid grid-cols-3 gap-4 mt-4">
        {project.sprints[0].tasks.map((task, index) => {
          return (
            <div key={index} className="w-72 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <Typography>{task.title}</Typography>
                <div className="py-2 px-4 flex justify-center items-center bg-cyan-200 rounded-full">
                  <span className="text-xs text-sky-500">{task.status}</span>
                </div>
              </div>
              <Button
                variant="outlined"
                color="black"
                className="mt-4"
                onClick={() => {
                  setTaskSelected(task);
                }}
              >
                View details
              </Button>
            </div>
          );
        })}
      </div>
      {taskSelected ? (
        <CreateBacklogDialog task={taskSelected} assigneeList={assigneeList} />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default BackLogDialog;
