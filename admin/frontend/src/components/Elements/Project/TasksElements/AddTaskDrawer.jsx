import React, {useEffect, useRef, useState} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
    Drawer,
    Button,
    FileInput,
    rem,
    Textarea,
    Text,
    ScrollArea,
    useMantineTheme,
    Group,
    TextInput
} from '@mantine/core';
import {IconCheck, IconFile, IconPaperclip, IconPlus} from '@tabler/icons-react';
import ContentEditable from 'react-contenteditable'; 
import TaskAssignTo from './Task/TaskAssignTo';
import TaskFollower from './Task/TaskFollower';
import TaskDueDate from './Task/TaskDueDate';
import TaskPriority from './Task/TaskPriority';
import TaskTag from './Task/TaskTag';
// import TaskComment from './TaskComment';
import {useDispatch, useSelector} from "react-redux";
import {createTask, editTask, removeSuccessMessage} from "../../../Settings/store/taskSlice";
import DueDate from "./Task/DueDate";
import dayjs from "dayjs";
import Priority from "./Task/Priority";
import TaskTagForTaskAdd from "./Task/TaskTagForTaskAdd";
import {notifications} from "@mantine/notifications";

const AddTaskDrawer = ({ view, projectId, taskSectionId }) => {
    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {success} = useSelector((state) => state.settings.task);

    const icon = <IconPaperclip style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [taskCreateDrawerOpen, { open: openTaskCreateDrawer, close: closeTaskCreateDrawer }] = useDisclosure(false);

    const [taskName, setTaskName] = useState('Type task name here');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedFollower, setSelectedFollower] = useState(null);
    const [selectedDueDate, setSelectedDueDate] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedTags, setSelectedTags] = useState(null);


  const [attachments, setAttachments] = useState([]);

    const handleAssignButtonClick = (member) => {
        setSelectedMember(member);
    }

    const handleAssignFollower = (members) => {
        setSelectedFollower(members);
    }
    const handleDueDateSelect = (date) => {
        if(date){
            var formatedDate = dayjs(date).format('YYYY-MM-DD');
            setSelectedDueDate(formatedDate)
        }
    };

    const handlePriority = (priority) => {
        setSelectedPriority(priority);
    }

    const handleTag = (tag) => {
        setSelectedTags(tag);
    }
  const handleFileUpload = (files) => {
    console.log('Uploaded files:', files); // Check uploaded files
    setAttachments(Array.from(files)); // Convert files to an array
    console.log('Attachments:', attachments); // Check updated state
};
    useEffect(() => {
        if(taskCreateDrawerOpen===false){
            // setShowMembersList(workspaceCreateModalOpen);
            handleTaskCreation();
        }
    }, [taskCreateDrawerOpen]);
    const handleTaskCreation = () => {
        const newTaskData = {
            name: taskName,
            project_id: projectId,
            task_section_id: taskSectionId,
            created_by: loggedUserId,
            assigned_to: selectedMember,
            members: selectedFollower,
            start_date: selectedDueDate,
            end_date: selectedDueDate,
            priority: selectedPriority,
            type:'task',
            description: taskDescription,
            tags: selectedTags,
            status: 'ACTIVE'
        };
        if(newTaskData.name!=='' && newTaskData.name!=='Type task name here'){
            dispatch(createTask(newTaskData));
            setTaskName('Type task name here');
            setTaskDescription('');
            // setCurrentMemberData([]);

            if(success){
                notifications.show({
                    color: theme.primaryColor,
                    title: success,
                    icon: <IconCheck />,
                    autoClose: 5000,
                    // withCloseButton: true,
                });
                const timer = setTimeout(() => {
                    dispatch(removeSuccessMessage());
                }, 5000); // Clear notification after 3 seconds

                return () => clearTimeout(timer);
            }
        }
    };
    const handleAddTaskDrawerOpen = () => {
        openTaskCreateDrawer();
    };
  return (
    <>
        <div className="drawer">
            {view && view === 'listView' ?
                <Group justify="center">
                    <Button
                        size="md"
                        color={`#ED7D31`}
                        onClick={handleAddTaskDrawerOpen}
                        leftSection={<IconPlus stroke={1.25} size={20} color={`#ED7D31`}/>}
                        variant="transparent">
                        Add Task
                    </Button>
                </Group>
                :
                <button onClick={handleAddTaskDrawerOpen}>
                    <span className="text-[#ED7D31] font-semibold text-[14px]">+ Add Task</span>
                </button>
            }


            <Drawer
                opened={taskCreateDrawerOpen}
                onClose={closeTaskCreateDrawer}
                position="right"
              withCloseButton={false} size="lg"
          overlayProps={{ backgroundOpacity: 0, blur: 0 }}
          >
            <div className="mt-4">

              <Drawer.Body className="!px-1">
                <div className="drawer-head flex mb-4 w-full items-center">
                  <div className="w-[85%]">
                      <TextInput
                          className="focus:border-black-600"
                          defaultValue={taskName}
                          onChange={(e) => setTaskName(e.target.value)}
                          onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                  handleTaskCreation();
                                  setTaskName('Type task name here');
                                  closeTaskCreateDrawer();
                              }
                          }}
                      />
                  {/*<ContentEditable
                      onChange={(e) => setTaskName(e.target.value)}
                    html={taskName}
                    className="inline-block w-full text-[#4d4d4d] font-bold text-[16px]"
                  />*/}
                  </div>
                  <div className="dh-btn flex w-[10%]">
                    <div className="attachment w-[35px] mt-[-3px]">
                      <FileInput
                            multiple
                            variant="unstyled"
                            rightSection={icon}
                            rightSectionPointerEvents="none"
                            clearable
                            onChange={handleFileUpload}
                        />
                    </div>
                    <Drawer.CloseButton />

                  </div>
                </div>
                  <ScrollArea className="h-[calc(100vh-130px)]" scrollbarSize={4}>
                    <div className="tasks-body flex flex-col gap-4 relative">
                        <div className="flex z-[104]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Assign To</Text>
                            </div>
                            <div className={`relative`}>
                                <TaskAssignTo assignedMember={(props) => {
                                    handleAssignButtonClick(props);
                                }} />
                            </div>
                        </div>
                        <div className="flex z-[103]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Following</Text>
                            </div>
                            <div className={`relative`}>
                                <TaskFollower editHandler={(props) => {
                                    handleAssignFollower(props);
                                }}/>
                            </div>
                        </div>
                        <div className="flex z-[102]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Due Date</Text>
                            </div>
                            <DueDate editHandler={(props)=>{
                                handleDueDateSelect(props)
                            }} dueDate={selectedDueDate}/>
                        </div>
                        <div className="flex z-[101]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Priority</Text>
                            </div>
                            <div className="border border-solid border-grey rounded-md">
                                <Priority editPriorityHandler={(props) => {
                                    console.log(props)
                                    handlePriority(props)
                                }} />
                            </div>
                        </div>
                        <div className="flex z-[100]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Tags</Text>
                            </div>
                            <TaskTagForTaskAdd  onChangeSelectedItem={(value)=>{
                                handleTag(value)
                            }} />
                        </div>
                        <div className="flex z-[100]">
                            <div className="w-1/3">
                                <Text fw={400} fz={14} c="#202020">Attachments</Text>
                            </div>
                            <div className='flex flex-wrap gap-3'>
                              {attachments.map((attachment, index) => (
                                  <div key={index} className='bg-[#EBF1F4] rounded-[20px] px-2 py-1 flex gap-2 items-center'> <IconFile size={14}/><Text fw={400} fz={14} c="#202020">{attachment.name}</Text> </div>
                              ))}
                              <div className="attachment w-[35px]">
                              <FileInput
                                    multiple
                                    variant="unstyled"
                                    rightSection={icon}
                                    rightSectionPointerEvents="none"
                                    clearable
                                    onChange={handleFileUpload}
                                />
                            </div>
                          </div>
                        </div>
                        <div className="flex z-0">
                            <Textarea
                                label="Description"
                                description=""
                                style={{ width: '100%' }}
                                autosize
                                minRows={4}
                                placeholder="What is the task about"
                                onChange={(e) => setTaskDescription(e.target.value)}
                                />
                        </div>
                        <div className="flex">
                            <button className="mt-1">
                                <span className="text-sm font-medium text-[#ED7D31]">+ Add sub task</span>
                            </button>
                        </div>

                        {/*<div className="commentbox">
                            <TaskComment />
                        </div>*/}
                    </div>
                  </ScrollArea>
              </Drawer.Body>
            </div>

          </Drawer>
        </div>
    </>
  );
};


export default AddTaskDrawer;