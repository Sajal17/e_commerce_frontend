import React from "react";

const Loader = ({ size = 16, color = "blue" }) => {
  const spinnerSize = `${size} h-${size} w-${size}`;

  return (
    <div className="flex justify-center items-center py-10">
      <div
        className={`animate-spin rounded-full border-4 border-t-${color}-500 border-b-${color}-500 border-l-gray-200 border-r-gray-200 w-12 h-12`}
      ></div>
    </div>
  );
};

export default Loader;