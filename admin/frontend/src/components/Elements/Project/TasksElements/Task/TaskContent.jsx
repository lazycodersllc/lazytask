import React, {Fragment, useState} from 'react';
import { ReactSortable } from 'react-sortablejs'; 
import SubtaskContent from './SubtaskContent';
import MainTask from './MainTask';
import { useSelector, useDispatch } from 'react-redux';
import {createTask, deleteTask} from "../../../../Settings/store/taskSlice";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {Accordion, Button, Pill, Text, Title} from "@mantine/core";
import {hasPermission} from "../../../../ui/permissions";
import {IconChevronDown, IconPlus, IconTrash} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import TaskDelete from "./TaskDelete";
import {updateInputFieldFocus} from "../../../../../store/base/commonSlice";

const TaskContent = ({ view, taskData }) => {
    const dispatch = useDispatch();
    const { childColumns } = useSelector((state) => state.settings.task);
    const [subtasks, setSubtasks] = useState(childColumns && childColumns[taskData.slug] && childColumns[taskData.slug].length?[...Array(childColumns[taskData.slug].length).keys()]:[]);
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)

    const addSubtask = () => {
      setSubtasks([...subtasks, subtasks.length]);

      const newTaskData = {
          name: 'Type task name here',
          parent: taskData,
          task_section_id: taskData.task_section_id,
          project_id: taskData.project_id,
          type:'sub-task',
          created_by: loggedUserId,
          status: 'ACTIVE'
      }
      dispatch(createTask(newTaskData));
      dispatch(updateInputFieldFocus(true));
    };
  const onSortEnd = (sortedList) => {
    setSubtasks(sortedList);
  };

  const [selectedAccordion, setSelectedAccordion] = useState('');
    const toggleSection = (section) => {
        setSelectedAccordion(section);
    };

  return (
    <Fragment>
      {view === 'cardView' ? (
        <div className="full-project-tasks flex-col shadow-md m-4 p-3 rounded-md border border-1 border-[#efefef] gap-3">  
          <MainTask view='cardView' addSubtask={addSubtask} task={taskData}/>
          </div>
      ) : (
          <div className="full-project-tasks">
              <Accordion
                  value={selectedAccordion}
                  onChange={setSelectedAccordion}
                  chevronPosition="left"
                         chevron={<IconChevronDown size={30} stroke={2} />}
                         classNames={{
                              control: '!p-0 !w-auto',
                              content: '!pr-0',
                              label: '!py-0 !pt-1',
                              chevron: '!mx-0 !ml-1',
                              // chevron: classes.chevron
                            }}
              >
                  <Accordion.Item value={taskData && taskData.slug}>
                      <div className="flex w-full items-center py-1.5">
                          <div className="flex w-full items-center">
                              {/*<Pill className="!bg-[#ED7D31] !text-white !px-2">{childColumns && childColumns[taskData.slug] && childColumns[taskData.slug].length > 0 ? childColumns[taskData.slug].length : 0 }</Pill>*/}
                              <MainTask addSubtask={addSubtask} task={taskData}/>
                          </div>
                          <div className="flex items-center gap-2">

                              {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'sub-task-add']) &&
                                  <div onClick={(e) => e.stopPropagation()}>
                                      <div
                                          title={`Sub task add`}
                                          className="h-[20px] w-[20px] border border-solid border-[#4d4d4d] rounded-full p-[2px] create-subtask"
                                          onClick={()=>{
                                              toggleSection(taskData.slug);
                                              addSubtask();
                                          }}>
                                          <IconPlus color="#4d4d4d" size="14" className="cursor-pointer"/>
                                      </div>
                                  </div>
                              }
                              <TaskDelete task={taskData} taskId={taskData && taskData.id} />
                              <Accordion.Control>

                              </Accordion.Control>
                          </div>

                      </div>

                      <Accordion.Panel>
                          <Droppable
                              key={taskData.id}
                              droppableId={taskData.slug}
                              type='SUBTASK'
                              >
                                  {(dropProvided, snapshot) => (
                                      <div
                                          style={{transition: 'background-color 0.3s ease'}}
                                          className={`w-full h-full min-h-[20px] ${childColumns && childColumns[taskData.slug] && childColumns[taskData.slug].length > 0 ? 'pb-2 pt-3 bg-[#E7E7E7]' : ''}`}
                                          ref={dropProvided.innerRef}
                                          {...dropProvided.droppableProps}
                                      >
                                          {childColumns && childColumns[taskData.slug] && childColumns[taskData.slug].length > 0 && childColumns[taskData.slug].map((subTask, subtaskIndex) => (
                                              <Draggable
                                                  key={subTask.id}
                                                  draggableId={subTask.id.toString()}
                                                  index={subtaskIndex}
                                              >
                                                  {(dragProvided) => (
                                                      <div
                                                          key={subtaskIndex}
                                                          className='py-1 single-task'
                                                          ref={dragProvided.innerRef}
                                                          {...dragProvided.draggableProps}
                                                          {...dragProvided.dragHandleProps}
                                                      >
                                                          <SubtaskContent taskData={taskData} key={subtaskIndex}
                                                                          subtask={subTask}/>

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
          
        )}
    </Fragment>
  );
};

export default TaskContent;
