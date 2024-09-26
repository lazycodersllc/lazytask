import React, {Fragment} from 'react';
import TaskList from './TasksElements/TaskList';
import {ScrollArea, Text} from "@mantine/core";

const ProjectDetailsList = (props) => {
     

    return (
        <Fragment>
            <div className="border rounded-lg px-2 py-1 bg-blue-100">
                <div className="flex items-justified-start md:w-[94%] 2xl:w-[96%]">
                    <div className="text-base font-medium w-[30%]">
                        <Text className={`!pl-[30px]`} fz="md" fw={700}>Task Name</Text>
                    </div>
                    <div className="text-base font-medium w-[10%]">
                        <Text className={`!pl-[0px]`} fz="md" fw={700}>Assign To</Text>
                    </div>
                    <div className="text-base font-medium w-[12%]">
                        <Text fz="md" fw={700}>Following</Text>
                    </div>
                    <div className="text-base font-medium w-[10%]">
                        <Text fz="md" fw={700}>Due Date</Text>
                    </div>
                    <div className="text-base font-medium w-[10%]">
                        <Text fz="md" fw={700}>Priority</Text>
                    </div>
                    <div className="text-base font-medium w-[28%]">
                        <Text fz="md" fw={700}>Tags</Text>
                    </div>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-270px)] pb-[1px]" scrollbarSize={4}>
                <div className="relative w-full pt-4">
                    <TaskList/>
                </div>
            </ScrollArea>
        </Fragment>
    );
}

export default ProjectDetailsList;
