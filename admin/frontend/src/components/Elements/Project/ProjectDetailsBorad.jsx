import React from 'react';
import TaskBoard from "./TasksElements/TaskBoard";
import {ScrollArea} from "@mantine/core";

const ProjectDetailsBoard = () => {

  return (
      <ScrollArea className="h-[calc(100vh-240px)] pb-[2px]" scrollbarSize={8}>
      <div className="relative w-full pt-2">
          <TaskBoard/>
      </div>
      </ScrollArea>
  );
};

export default ProjectDetailsBoard;
