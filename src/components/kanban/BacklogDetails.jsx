import React from "react";
import PropTypes from "prop-types";
import accountAPI from "../../apis/accountApi";
import { Spinner, Typography } from "@material-tailwind/react";
import formatDate from "../../util/formatDate";

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
        const res = await accountAPI.getById({ id: backlog.createBy });
        setCreateBy(res);
        const res2 = await accountAPI.getById({ id: backlog.assignee });
        setAssignee(res2);
        setIsLoading(false);
      } catch (error) {
        console.log("Failed to fetch data user: ", error);
      }
    };

    fetchDataUser();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
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
