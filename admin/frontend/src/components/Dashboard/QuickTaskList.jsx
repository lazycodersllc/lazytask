import React, {useState, useEffect, Fragment, useRef} from 'react';
import {
    ActionIcon,
    Button,
    Input,
    Menu,
    rem,
    ScrollArea,
    Textarea,
    TextInput,
    Title,
    Text,
    useMantineTheme, Card, Group
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {createQuickTask} from "../Settings/store/quickTaskSlice";
import dayjs from "dayjs";
import {IconDeviceFloppy, IconEdit} from "@tabler/icons-react";
import {Link} from "react-router-dom";
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
      <>
          <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs" className="bg-[#EBF1F4]">
                  <Group>
                      {/*<IconGripVertical size="20" />*/}
                      {/*<IconCalendar size={20} />*/}
                      <Title order={6}>Quick Task</Title>
                  </Group>
              </Card.Section>

              <Card.Section mt="xs" px="xs">
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
                              <IconDeviceFloppy style={{width: '18px', height: '18px'}} stroke={1.5}/>
                          </ActionIcon>
                      }
                  />
              </Card.Section>
              <Card.Section px="xs" pb="xs">
                  <ScrollArea className="relative h-[202px] pb-[3px]" scrollbarSize={4}>
                      <div className="">
                          {tasks && tasks.length > 0 && tasks.map((task, index) => (
                              <div className="border-b">
                                  <div onDoubleClickCapture={()=>{handleEditTaskDrawerOpen(task)}} className="content px-2 py-2 cursor-pointer">
                                      <Text fz="sm">{task.name}</Text>
                                  </div>
                              </div>
                          ))
                          }

                      </div>
                      {tasks && tasks.length > 0 &&
                          <div className="absolute bottom-2 right-0 bg-white">
                              <Link to={`/my-task`}>
                                  <Button color="#ED7D31" radius="xl" size="compact-xs">
                                      More...
                                  </Button>
                              </Link>
                          </div>
                      }

                  </ScrollArea>
              </Card.Section>
          </Card>
          {
              selectedTask && ( <AddTaskFromQuickTaskDrawer task={selectedTask} taskEditDrawerOpen={taskEditDrawerOpen} openTaskEditDrawer={openTaskEditDrawer} closeTaskEditDrawer={closeTaskEditDrawer}  />)
            }
      </>
  );
};

export default QuickTaskList;
