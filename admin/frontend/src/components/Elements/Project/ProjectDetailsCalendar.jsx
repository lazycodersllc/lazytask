import React from 'react';
import {Flex, ScrollArea} from "@mantine/core";
import TaskCalendar from "./TasksElements/TaskCalendar";

const ProjectDetailsCalendar = () => {

  return (
      <ScrollArea className="h-[calc(100vh-240px)] pb-[2px]" scrollbarSize={5} offsetScrollbars>
          <Flex justify="center" align="center" className="w-full h-full">
              <div className="relative items-center w-11/12 pt-2">
                  <TaskCalendar/>
              </div>
          </Flex>
      </ScrollArea>
  );
};

export default ProjectDetailsCalendar;
