import {useState, useEffect, Fragment} from 'react';
import React from 'react';
import {IconPlus} from "@tabler/icons-react";
import TaskName from "./Task/TaskName";
import TaskAssignTo from "./Task/TaskAssignTo";
import TaskDueDate from "./Task/TaskDueDate";
import TaskPriority from "./Task/TaskPriority";
import TaskTag from "./Task/TaskTag";
import TaskFollower from "./Task/TaskFollower";
import {useDisclosure} from "@mantine/hooks";
import EditMyTaskDrawer from "./EditMyTaskDrawer";
import MyTaskRow from "./MyTaskRow";
import {useSelector} from "react-redux";

const MyTaskListContent = ({ contents }) => {
  // const sectionTasks = contents;
  const [tasks, setTasks] = useState([]);
    const {userTaskChildColumns} = useSelector((state) => state.settings.myTask);
  useEffect(() => {
    if (Array.isArray(contents)) {
      setTasks([...contents]);
    } else {
      setTasks([]);
    }
  }, [contents]);

  return (
      <Fragment>

        <div
            style={{transition: 'background-color 0.3s ease'}}
            className="w-full h-full min-h-[25px] px-2">
          {tasks && tasks.length>0 && tasks.map((task, taskIndex) => (
              <div
                  key={taskIndex}
                  className='relative w-full items-center py-1.5'
              >

                  <MyTaskRow task={task} />
                  {userTaskChildColumns && userTaskChildColumns[task.slug] && userTaskChildColumns[task.slug].length > 0 && userTaskChildColumns[task.slug].map((subTask, subtaskIndex) => (
                      <div
                          key={subtaskIndex}
                          className='my-2 pl-5 single-task'
                      >
                          <MyTaskRow task={subTask}/>
                      </div>
                  ))
                  }
              </div>

          ))
          }
        </div>

      </Fragment>
  );
};

export default MyTaskListContent;
