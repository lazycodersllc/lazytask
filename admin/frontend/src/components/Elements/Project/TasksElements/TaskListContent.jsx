import {useState, useEffect, Fragment} from 'react';
import React from 'react'; 
import TaskContent from './Task/TaskContent';
import { ReactSortable } from 'react-sortablejs';
import AddTaskDrawer from './AddTaskDrawer'; 
import { useSelector, useDispatch } from 'react-redux';
import {Draggable, Droppable} from "react-beautiful-dnd";
import {hasPermission} from "../../../ui/permissions";

const TaskListContent = ({ listType, view, taskSection, projectId, taskSectionId, contents }) => {
  // const sectionTasks = contents;
  const [tasks, setTasks] = useState(contents || []);
    const {loggedInUser} = useSelector((state) => state.auth.session)

// console.log(sectionTasks)
  useEffect(() => {
   setTasks(contents || []);
  }, [contents]);

  
  const handleAddTask = () => {
    setTasks(prevTasks => [...prevTasks, prevTasks.length]);
  };

  const onSortEnd = sortedList => {
    // Update the state with the new sorted list
    setTasks(sortedList);
  };

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
                className={`w-full h-full min-h-[25px] ${tasks && tasks.length ===0 ? 'border-b border-gray-200' : ''}`}
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
            >
              {tasks && tasks.map((task, taskIndex) => (
                  <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={taskIndex}
                  >
                        {(dragProvided) => (
                            <div
                                key={taskIndex}
                                className='mb-0 mt-0 single-task'
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                            >
                                <TaskContent view={'listView'} taskSection={taskSection} taskData={task}/>
                            </div>
                        )}
                  </Draggable>

              ))}
                {dropProvided.placeholder}
            </div>
        )}

      </Droppable>

        { view === 'listView' && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee']) && (
            <AddTaskDrawer view = 'listView' projectId={projectId} taskSectionId={taskSectionId} />
        )}

    </Fragment>
  );
};

export default TaskListContent;
