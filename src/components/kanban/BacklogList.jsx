import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import BacklogDetails from "./BacklogDetails";
import Navigation from "../navigation/navigation";

BacklogList.propTypes = {
  list: PropTypes.array.isRequired,
};

function BacklogList({ list }) {
  return (
    <div>
      <Typography>Backlog list</Typography>
      <div className="mt-4">
        {list.length === 0 ? (
          <Typography>No backlogs available</Typography>
        ) : (
          list.map((backlog, index) => (
            <div key={index} className="p-4 bg-gray-100">
              <BacklogDetails backlog={backlog} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BacklogList;
