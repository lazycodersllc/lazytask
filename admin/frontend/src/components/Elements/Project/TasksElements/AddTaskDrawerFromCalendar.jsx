import React, {useCallback, useEffect, useRef, useState} from 'react';
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
    TextInput, Select
} from '@mantine/core';
import {IconCheck, IconFile, IconPaperclip, IconPlus} from '@tabler/icons-react';
import ContentEditable from 'react-contenteditable'; 
// import TaskComment from './TaskComment';
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {notifications} from "@mantine/notifications";
import {createTask, removeSuccessMessage} from "../../../Settings/store/taskSlice";
import {useParams} from "react-router-dom";
import {fetchProjectPriorities, fetchProjectTaskSections} from "../../../Settings/store/projectSlice";
import TaskAssignTo from "./Task/TaskAssignTo";
import TaskFollower from "./Task/TaskFollower";
import DueDate from "./Task/DueDate";
import Priority from "./Task/Priority";
import TaskTagForTaskAdd from "./Task/TaskTagForTaskAdd";


const AddTaskDrawerFromCalendar = ({ startDate, endDate, project, taskAddDrawerOpen, openTaskAddDrawer, closeTaskAddDrawer }) => {


    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {success} = useSelector((state) => state.settings.task);

    const icon = <IconPaperclip style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

    const projectId = useParams().id;

    const [taskSectionId, setTaskSectionId] = useState(null);
    const [taskName, setTaskName] = useState( 'Type task name here');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedFollower, setSelectedFollower] = useState(null);
    const [selectedDueDate, setSelectedDueDate] = useState(startDate);
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
        console.log(taskAddDrawerOpen);
        if(taskAddDrawerOpen===false){
            handleTaskCreation();
        }
    }, [taskAddDrawerOpen]);

    useEffect(() => {
        setSelectedDueDate(startDate);
        },
        [startDate]);



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
        if(
            newTaskData.name!==''
            && newTaskData.name!=='Type task name here'
            && newTaskData.project_id
            && newTaskData.task_section_id
        ){
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

    const {projectSections} = useSelector((state) => state.settings.project);

    useEffect(() => {
        if(projectId){
            dispatch(fetchProjectTaskSections(projectId))
        }
    }, [projectId]);

    const onSectionChange = (e) => {
        if(e && e.value && e.value!==''){
           setTaskSectionId(e.value);
        }else {
            setTaskSectionId(null);
        }
    };


  return (
    <>
        {taskAddDrawerOpen &&
            <div className="drawer">

                <Drawer
                    opened={taskAddDrawerOpen}
                    onClose={() => {
                        closeTaskAddDrawer();
                    }}
                    position="right"
                    withCloseButton={false} size="lg" closeOnClickOutside={true}
                    overlayProps={{backgroundOpacity: 0, blur: 0}}
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
                                                closeTaskAddDrawer();
                                            }
                                        }}
                                    />

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
                                    <Drawer.CloseButton/>

                                </div>
                            </div>
                            <ScrollArea className="h-[calc(100vh-130px)]" scrollbarSize={4}>
                                <div className="tasks-body flex flex-col gap-4 relative">


                                    <div className="flex z-[104]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Section</Text>
                                        </div>
                                        <Select
                                            searchable
                                            clearable
                                            size="sm"
                                            placeholder="Select Section"
                                            data={ projectSections && projectSections.length > 0 && projectSections.map((section) => ({
                                                value: section.id,
                                                label: section.name
                                            }))}
                                            // defaultValue="React"
                                            allowDeselect
                                            onChange={(e, option) => {
                                                onSectionChange(option);
                                            }}
                                        />
                                    </div>
                                    <div className="flex z-[104] relative">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Assign To</Text>
                                        </div>
                                        <div className={`relative`}>
                                            <TaskAssignTo
                                                boardMembers={project && project.members && project.members.length > 0 ? project.members : []}
                                                assignedMember={(props) => {
                                                    handleAssignButtonClick(props);
                                                }}/>
                                        </div>
                                    </div>
                                    <div className="flex z-[103]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Following</Text>
                                        </div>
                                        <div className={`relative`}>
                                            <TaskFollower
                                                boardMembers={project && project.members && project.members.length > 0 ? project.members : []}
                                                editHandler={(props) => {
                                                    handleAssignFollower(props);
                                                }}/>
                                        </div>
                                    </div>
                                    <div className="flex z-[102]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Due Date</Text>
                                        </div>
                                        <DueDate editHandler={(props) => {
                                            handleDueDateSelect(props)
                                        }} dueDate={selectedDueDate}/>
                                    </div>
                                    <div className="flex z-[101]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Priority</Text>
                                        </div>
                                        <div className="border border-solid border-grey rounded-md">
                                            <Priority editPriorityHandler={(props) => {
                                                handlePriority(props)
                                            }}
                                                      projectPriorities={ project && project.projectPriorities && project.projectPriorities.length > 0 ? project.projectPriorities : []}/>
                                        </div>
                                    </div>
                                    <div className="flex z-[100]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Tags</Text>
                                        </div>
                                        <TaskTagForTaskAdd onChangeSelectedItem={(value) => {
                                            handleTag(value)
                                        }}/>
                                    </div>
                                    <div className="flex z-[100]">
                                        <div className="w-1/3">
                                            <Text fw={400} fz={14} c="#202020">Attachments</Text>
                                        </div>
                                        <div className='flex flex-wrap gap-3'>
                                            {attachments.map((attachment, index) => (
                                                <div key={index}
                                                     className='bg-[#EBF1F4] rounded-[20px] px-2 py-1 flex gap-2 items-center'>
                                                    <IconFile size={14}/><Text fw={400} fz={14}
                                                                               c="#202020">{attachment.name}</Text>
                                                </div>
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
                                            style={{width: '100%'}}
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
        }
    </>
  );
};


export default AddTaskDrawerFromCalendar;