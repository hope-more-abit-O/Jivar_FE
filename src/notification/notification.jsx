import React from "react";

const Notification = ({ message }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
      {message}
    </div>
  );
};

export default Notification;
