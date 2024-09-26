import React from 'react';
import {Text, Title} from '@mantine/core';

const TaskHeader = () => {


  return (
      <div className="border rounded-lg mt-1 px-2 py-1 bg-blue-100">
        <div className="flex">
          <div className="text-base font-medium w-[30%]">
            <Text fz="sm">Task Name</Text>
          </div>
          <div className="text-base font-medium w-[10%]">
            <Text fz="sm">Assign To</Text>
          </div>
          <div className="text-base font-medium w-[12%]">
            <Text fz="sm">Following</Text>
          </div>
          <div className="text-base font-medium w-[10%]">
            <Text fz="sm">Due Date</Text>
          </div>
          <div className="text-base font-medium w-[10%]">
            <Text fz="sm">Priority</Text>
          </div>
          <div className="text-base font-medium w-[28%]">
            <Text fz="sm">Tags</Text>
          </div>
        </div>
      </div>
  );
};

export default TaskHeader;
