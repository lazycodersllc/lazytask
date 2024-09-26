
import React from 'react'; 
import TaskName from './TaskName';
import TaskAssignTo from './TaskAssignTo';
import TaskFollower from './TaskFollower';
import TaskDueDate from './TaskDueDate';
import TaskPriority from './TaskPriority';
import TaskTag from './TaskTag';
import {useDisclosure} from "@mantine/hooks";
import EditTaskDrawer from "../EditTaskDrawer";
import TaskDelete from "./TaskDelete";

const SubtaskContent = ({taskData, subtask, view}) => {


  const [subTaskEditDrawerOpen, { open: openSubTaskEditDrawer, close: closeSubTaskEditDrawer }] = useDisclosure(false);

  const handleEditSubTaskDrawerOpen = () => {
    openSubTaskEditDrawer();
  };
// console.log(subtask, taskData);
  return (
    <> 

        {view === 'cardView' ? (
            <div onDoubleClickCapture={()=>{handleEditSubTaskDrawerOpen()}} className="sabtask mb-2" >
                <div className="flex single-task-content sub-task items-center gap-2 justify-between">
                    <TaskName task={subtask && subtask} taskId={subtask && subtask.id} view='cardView' isSubtask nameOfTask={subtask && subtask.name ? subtask.name : "Untitled Subtask"} />
                    <div className="flex items-center gap-2">
                        <TaskDueDate taskId={subtask && subtask.id} dueDate={subtask && subtask.end_date ? subtask.end_date : null}/>
                        <TaskAssignTo
                            taskId={subtask && subtask.id}
                            view='cardView'
                            assigned={subtask && subtask.assigned_to ? subtask.assigned_to : null}
                            assignedMember={(props) => {
                              console.log('')
                            }}/>
                    </div>
                </div>  
            </div>

            ) : ( 
                
            <div onDoubleClickCapture={()=>{handleEditSubTaskDrawerOpen()}} className="sabtask pl-[5px]" >
                <div className="flex single-task-content sub-task">
                    <div className="task-name w-[27%] 2xl:w-[28%] pr-3 items-center">
                        <div className="flex gap-2 items-center ml-2">
                            {/* <TaskName isSubtask nameOfTask={subtask.name} /> */}
                            <TaskName task={subtask && subtask} taskId={subtask && subtask.id} isSubtask nameOfTask={subtask && subtask.name ? subtask.name : "Untitled Subtask"} />
                        </div>
                    </div>
                    <div className="assign-to w-[9.6%]">
                        {/* <TaskAssignTo assigned={subtask.assigned_to}/> */}
                        <TaskAssignTo
                            taskId={subtask && subtask.id}
                            assigned={subtask && subtask.assigned_to ? subtask.assigned_to : null}
                            assignedMember={(props) => {
                              console.log('')
                            }}
                        />
                    </div>
                    <div className="following w-[12%]">
                        {/* <TaskFollower followers={subtask.members}/> */}
                        <TaskFollower taskId={subtask && subtask.id} followers={subtask && subtask.members ? subtask.members : null} editHandler={(props) => {
                          console.log('')
                        }}/>
                    </div>
                    <div className="due-date w-[9.5%]">
                        {/* <TaskDueDate dueDate={subtask.end_date}/> */}
                        <TaskDueDate taskId={subtask && subtask.id} dueDate={subtask && subtask.end_date ? subtask.end_date : null}/>
                    </div>
                    <div className="priority w-[9.6%]">
                        {/* <TaskPriority priority={subtask.priority}/> */}
                        <TaskPriority taskId={subtask && subtask.id} priority={subtask && subtask.priority ? subtask.priority : null}/>
                    </div>
                    <div className="tags w-[28.5%]">
                        {/* <TaskTag tags={subtask.members} /> */}
                        <TaskTag taskId={subtask && subtask.id} taskTags={subtask && subtask.tags ? subtask.tags : null} />
                    </div>
                  <TaskDelete task={subtask} taskId={subtask && subtask.id} isSubtask />
                </div>
            </div>
            
        )}

      {subTaskEditDrawerOpen && <EditTaskDrawer taskObj={subtask} taskId={subtask && subtask.id} taskEditDrawerOpen={subTaskEditDrawerOpen} openTaskEditDrawer={openSubTaskEditDrawer} closeTaskEditDrawer={closeSubTaskEditDrawer} />}

    </>
  );
};

export default SubtaskContent;
