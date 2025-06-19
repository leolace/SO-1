import React from "react";

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-2  border-gray-500 border-b-transparent"></div>
    </div>
  );
};

export default Spinner;