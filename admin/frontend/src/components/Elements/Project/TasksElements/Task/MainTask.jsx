import React, {Fragment, useState} from 'react';
import TaskName from './TaskName';
import TaskAssignTo from './TaskAssignTo';
import TaskFollower from './TaskFollower';
import TaskDueDate from './TaskDueDate';
import TaskPriority from './TaskPriority';
import TaskTag from './TaskTag';
import {IconPlus, IconSubtask} from '@tabler/icons-react';
import EditTaskDrawer from "../EditTaskDrawer";
import {useDisclosure} from "@mantine/hooks";
import {useSelector} from "react-redux";
import {hasPermission} from "../../../../ui/permissions";
import {Accordion, Box, Pill} from "@mantine/core";
import {Draggable, Droppable} from "react-beautiful-dnd";
import SubtaskContent from "./SubtaskContent";

const MainTask = ({ addSubtask, task, view }) => {
    const {loggedInUser} = useSelector((state) => state.auth.session)
    const { childColumns } = useSelector((state) => state.settings.task);
    const [taskEditDrawerOpen, { open: openTaskEditDrawer, close: closeTaskEditDrawer }] = useDisclosure(false);

    const handleEditTaskDrawerOpen = () => {
        openTaskEditDrawer();
    };

    const [selectedAccordion, setSelectedAccordion] = useState('');
    const toggleSection = (section) => {
        setSelectedAccordion(section);
    };

  return (
    <>
      {view === 'cardView' ? (

        <Fragment>
            <div className="flex single-task-content main-task flex-col gap-3">
                <Box onDoubleClickCapture={()=>{handleEditTaskDrawerOpen()}} component="div">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="task-name">
                            <TaskName task={task && task} taskId={task.id} nameOfTask={task.name} view='cardView'/>
                        </div>
                        <div className="assign-to">
                            <TaskAssignTo taskId={task.id} assigned={task.assigned_to} view='cardView'
                                          assignedMember={(props) => {
                                              console.log('')
                                          }}/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="due-date">
                            <TaskDueDate taskId={task.id} dueDate={task.end_date}/>
                        </div>
                        <div className="priority">
                            <TaskPriority taskId={task.id} priority={task.priority}/>
                        </div>
                    </div>
                    <div className="tags">
                        {task.tags && task.tags.length > 0 &&
                            <TaskTag taskId={task.id} taskTags={task.tags}/>
                        }
                    </div>
                </Box>

                <Accordion
                    chevronPosition="right"
                    classNames={{
                        control: '!p-0 !pr-2 !w-auto',
                        content: '!px-0',
                        label: '!py-0 !pt-1',
                        chevron: '!mx-0 !ml-1',
                        // chevron: classes.chevron
                    }}
                   value={selectedAccordion}
                   onChange={setSelectedAccordion}
                >
                    <Accordion.Item value={task && task.slug}>
                        <div className="flex w-full items-center mb-2">
                            <div className="w-full following flex gap-1">
                                <TaskFollower taskId={task.id} followers={task.members} editHandler={(props) => {
                                    console.log('')
                                }}/>
                                {task.tags && task.tags.length === 0 &&
                                    <TaskTag taskId={task.id} taskTags={task.tags}/>
                                }
                            </div>
                            <IconSubtask color="#ED7D31" size="22"/>
                            <Pill
                                className="!bg-[#ED7D31] !text-white !px-2 !ml-1">{childColumns && childColumns[task.slug] && childColumns[task.slug].length > 0 ? childColumns[task.slug].length : 0 }</Pill>
                            <Accordion.Control>

                            </Accordion.Control>
                        </div>
                        <Accordion.Panel>

                            <Droppable
                                key={task.id}
                                droppableId={task.slug}
                                type='SUBTASK'
                            >
                                {(dropProvided, snapshot) => (
                                    <div
                                        style={{ transition: 'background-color 0.3s ease' }}
                                        className="w-full h-full min-h-[20px]"
                                        ref={dropProvided.innerRef}
                                        {...dropProvided.droppableProps}
                                    >
                                        {childColumns && childColumns[task.slug] && childColumns[task.slug].length > 0 && childColumns[task.slug].map((subTask, subtaskIndex) => (
                                            <Draggable
                                                key={subTask.id}
                                                draggableId={subTask.id.toString()}
                                                index={subtaskIndex}
                                            >
                                                {(dragProvided) => (
                                                    <div
                                                        key={subtaskIndex}
                                                        className='my-2 single-task'
                                                        ref={dragProvided.innerRef}
                                                        {...dragProvided.draggableProps}
                                                        {...dragProvided.dragHandleProps}
                                                    >
                                                        <SubtaskContent taskData={task}  key={subtaskIndex} subtask={subTask} view='cardView'/>
                                                    </div>
                                                )}

                                            </Draggable>
                                        ))}
                                        {dropProvided.placeholder}
                                    </div>
                                )}

                            </Droppable>

                        </Accordion.Panel>
                    </Accordion.Item>


                </Accordion>
            </div>
            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'sub-task-add']) &&
                <div className="flex justify-end pt-3">
                    <button className="float-right" onClick={()=>{
                        toggleSection(task.slug);
                        addSubtask();
                    }}>
                        <span className="text-[#ED7D31] font-semibold text-[14px]">+ Subtask</span>
                    </button>
                </div>
            }
        </Fragment>

      ) : (
          <div onDoubleClickCapture={() => {
              handleEditTaskDrawerOpen()
          }} className="flex single-task-content main-task items-center w-full">
              <div className="task-name w-[30%] pr-2 items-center">
                  <div className="flex gap-2 items-center w-full">
                      <div
                          className="w-full"
                          onClick={(e) => e.stopPropagation()}>
                          <TaskName task={task && task} taskId={task.id} nameOfTask={task.name}/>
                      </div>

              </div>
          </div>
            <div className="assign-to w-[10%]">
                <div onClick={(e) => e.stopPropagation()}>
                    <TaskAssignTo taskId={task.id} assigned={task.assigned_to} assignedMember={(props) => {
                        console.log('')
                    }}/>
                </div>
            </div>
            <div className="following w-[12%]">
              <div className={`pl-[3px]`} onClick={(e) => e.stopPropagation()} >
                  <TaskFollower taskId={task.id} followers={task.members} editHandler={(props) => {
                      console.log('')
                  }}/>
              </div>
          </div>
          <div className="due-date w-[10%]">
              <div className={`pl-[5px]`} onClick={(e) => e.stopPropagation()} >
                  <TaskDueDate taskId={task.id} dueDate={task.end_date}/>
              </div>
          </div>
          <div className="priority w-[10%]">
              <div className="pl-1" onClick={(e) => e.stopPropagation()}>
                  <TaskPriority taskId={task.id} priority={task.priority}/>
              </div>
          </div>
          <div className="tags w-[28%]">
              <div onClick={(e) => e.stopPropagation()}>
                  <TaskTag taskId={task.id} taskTags={task.tags} />
              </div>
          </div>
        </div>
      )}

        {taskEditDrawerOpen && <EditTaskDrawer taskObj={task} taskId={task && task.id} taskEditDrawerOpen={taskEditDrawerOpen} openTaskEditDrawer={openTaskEditDrawer} closeTaskEditDrawer={closeTaskEditDrawer} />}
    </>

    
  );
};

export default MainTask;
