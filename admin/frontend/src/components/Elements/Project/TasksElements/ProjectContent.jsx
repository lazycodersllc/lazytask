import {useState, useEffect, Fragment} from 'react';
import React from 'react'; 
import TaskContent from './Task/TaskContent';
import { ReactSortable } from 'react-sortablejs';
import AddTaskDrawer from './AddTaskDrawer'; 
import { useSelector, useDispatch } from 'react-redux'; 

const ProjectContent = ({ view, taskSection, projectId, taskSectionId, contents }) => {
  // const sectionTasks = contents;
  const [tasks, setTasks] = useState([]);

// console.log(sectionTasks)
  useEffect(() => {
    if (Array.isArray(contents)) {
      setTasks([...Array(contents.length).keys()]);
    } else {
      setTasks([...Array(1).keys()]);
    }
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
      
      
      <ReactSortable
        list={tasks}
        setList={onSortEnd}
        animation={150}
        style={{ transition: 'background-color 0.3s ease' }}
      >
        {contents && contents.map((tasks, taskIndex) => (
          <div key={taskIndex} className='my-2 single-task'>
            {/* <TaskContent taskSection={taskSection} taskData={sectionTasks[taskIndex]}/>  */} 
            {view === 'cardView' && (
              <TaskContent view={'cardView'} taskSection={taskSection} taskData={tasks}/>
            )}
            {view === 'listView' && (
                // console.log(taskIndex)
              <TaskContent view={'listView'} taskSection={taskSection} taskData={tasks}/>
            )}
          </div>
        ))}
      </ReactSortable>
      {view === 'listView' && ( 
        <AddTaskDrawer projectId={projectId} taskSectionId={taskSectionId} />
      )}

    </Fragment>
  );
};

export default ProjectContent;
