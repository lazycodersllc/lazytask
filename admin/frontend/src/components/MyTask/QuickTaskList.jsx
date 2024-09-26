import React, {useState, useEffect, Fragment, useRef} from 'react';
import {ActionIcon, Input, ScrollArea, Text, Textarea, TextInput, Title, useMantineTheme} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {createQuickTask} from "../Settings/store/quickTaskSlice";
import dayjs from "dayjs";
import {IconArrowRight, IconDeviceFloppy} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import AddTaskFromQuickTaskDrawer from "../QuickTask/AddTaskFromQuickTaskDrawer";

const QuickTaskList = () => {

    const dispatch = useDispatch();
    const [newQuickTask, setNewQuickTask] = useState('');
    const {loggedUserId} = useSelector((state) => state.auth.user);
    const {tasks} = useSelector((state) => state.settings.quickTask);
    const handleInputChange = (e) => {
        setNewQuickTask(e.target.value);
    };
    const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (newQuickTask.trim() !== '') {
            const submitData = {
              name: newQuickTask,
              user_id:loggedUserId
            }
            dispatch(createQuickTask(submitData))
            setNewQuickTask('');
        }

        }
    };

    const handleInputClick = () =>{
        if (newQuickTask.trim() !== '') {
            const submitData = {
                name: newQuickTask,
                user_id:loggedUserId
            }
            dispatch(createQuickTask(submitData))
            setNewQuickTask('');
        }
    };

    const theme = useMantineTheme();

    const [selectedTask, setSelectedTask] = useState(null);

    const [taskEditDrawerOpen, { open: openTaskEditDrawer, close: closeTaskEditDrawer }] = useDisclosure(false);
    const handleEditTaskDrawerOpen = (task) => {
        setSelectedTask(task)
        openTaskEditDrawer();
    };
  return (
      <div className="bg-white p-2 border-l-2">
          {/*<h3> Quick Task</h3>*/}
          <Title className="mb-2 pb-2 border-b" order={6}> Quick Task</Title>

        <div className="px-0 my-2">
            <TextInput
                radius="xl"
                size="sm"
                placeholder="Enter task title"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                value={newQuickTask}
                rightSectionWidth={42}
                rightSection={
                    <ActionIcon onClick={handleInputClick} size={24} radius="xl" color="#ED7D31" variant="filled">
                        <IconDeviceFloppy style={{ width: '18px', height: '18px' }} stroke={1.5} />
                    </ActionIcon>
                }
            />

        </div>
        <ScrollArea className="h-[calc(100vh-270px)] pb-[2px]" scrollbarSize={4}>
            {tasks && tasks.length > 0 && tasks.map((task, index) => (
                <div className="border rounded-md my-3">
                  <div onDoubleClickCapture={()=>{handleEditTaskDrawerOpen(task)}} className="content px-2 py-2 cursor-pointer">
                      <Text fz="sm">{task.name}</Text>
                      <span className="text-xs text-blue-600">{dayjs(task.created_at).format('MMM D, YYYY')}</span>
                  </div>
                </div>
            ))
            }

        </ScrollArea>
          {
              selectedTask && ( <AddTaskFromQuickTaskDrawer task={selectedTask} taskEditDrawerOpen={taskEditDrawerOpen} openTaskEditDrawer={openTaskEditDrawer} closeTaskEditDrawer={closeTaskEditDrawer}  />)
          }
      </div>
  );
};

export default QuickTaskList;
