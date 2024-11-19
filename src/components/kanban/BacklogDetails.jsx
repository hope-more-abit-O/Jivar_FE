import React from "react";
import PropTypes from "prop-types";
import accountAPI from "../../apis/accountApi";
import { Spinner, Typography } from "@material-tailwind/react";
import formatDate from "../../util/formatDate";
import axios from "axios";

BacklogDetails.propTypes = {
  backlog: PropTypes.object.isRequired,
};

function BacklogDetails({ backlog }) {
  const [createBy, setCreateBy] = React.useState(null);
  const [assignee, setAssignee] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDataUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5287/api/v1/account/info/user/${backlog.createBy}`);
        const response = res.data
        console.log('createBy',response)
        setCreateBy(res.data || { name: "Unknown User" });
        
        const res2 = await axios.get(`http://localhost:5287/api/v1/account/info/user/${backlog.assignee}`);
        const response2 = res2.data
        console.log('assignee',response2)

        setAssignee(res2.data || { name: "Unknown User" });
      } catch (error) {
        console.error("Failed to fetch data user: ", error);
        const res = await axios.get(`http://localhost:5287/api/v1/account/info/user/${backlog.createBy}`);
        const res2 = await axios.get(`http://localhost:5287/api/v1/account/info/user/${backlog.assignee}`);
        setCreateBy(res.data || { name: "Unknown User" });
        setAssignee(res2.data || { name: "Unknown User" });
      } finally {
        setIsLoading(false);
      }
    };
  
    if (backlog?.createBy && backlog?.assignee) {
      fetchDataUser();
    }
  }, [backlog]);
  
  if (!backlog) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
        <Typography className="ml-2">Loading user details...</Typography>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-start items-end">
        <Typography className="font-bold me-3">Create by: </Typography>
        <Typography className="font-normal">{createBy.name}</Typography>
      </div>
      <div className="flex justify-start items-end mt-2">
        <Typography className="font-bold me-3">Assignee: </Typography>
        <Typography className="font-normal">{assignee.name}</Typography>
      </div>
      <div className="flex justify-start items-end mt-2">
        <Typography className="font-bold me-3">Content: </Typography>
        <Typography className="font-normal">{backlog.content}</Typography>
      </div>
      <div className="flex justify-start items-end mt-2">
        <Typography className="font-bold me-3">Create time: </Typography>
        <Typography className="font-normal">
          {formatDate(backlog.createTime)}
        </Typography>
      </div>
    </div>
  );
}

export default BacklogDetails;
