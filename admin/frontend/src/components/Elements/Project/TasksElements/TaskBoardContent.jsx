import {useState, useEffect, Fragment} from 'react';
import React from 'react'; 
import TaskContent from './Task/TaskContent';
import { ReactSortable } from 'react-sortablejs';
import AddTaskDrawer from './AddTaskDrawer'; 
import { useSelector, useDispatch } from 'react-redux';
import {Draggable, Droppable} from "react-beautiful-dnd";

const TaskBoardContent = ({ listType, view, taskSection, projectId, taskSectionId, contents }) => {
  // const sectionTasks = contents;
  const [tasks, setTasks] = useState(contents || []);

// console.log(sectionTasks)
  useEffect(() => {
    setTasks(contents || []);
  }, [contents]);

  return (
    <Fragment>
      <Droppable
          key={taskSection}
          droppableId={taskSection}
          type={listType}
          >
            {(dropProvided, snapshot) => (
                <div
                    style={{ transition: 'background-color 0.3s ease' }}
                    className="flex-1 w-full h-full"
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                >
                  {tasks && tasks.length > 0 && tasks.map((task, taskIndex) => (
                      <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={taskIndex}
                      >
                            {(dragProvided) => (
                                <div
                                    key={taskIndex}
                                    className='my-2 single-task'
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                >
                                    <TaskContent view={'cardView'} taskSection={taskSection} taskData={task}/>
                                </div>
                            )}
                      </Draggable>
                  ))}
                  {dropProvided.placeholder}
                </div>
            )}
      </Droppable>

    </Fragment>
  );
};

export default TaskBoardContent;
