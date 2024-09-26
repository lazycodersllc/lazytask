import { IconCheck, IconChevronDown, IconMinus } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {createProjectPriority} from "../../Settings/store/taskSlice";
import {editMyTask} from "../../Settings/store/myTaskSlice";
import {hasPermission} from "../../ui/permissions";

const TaskPriority = ({ task, priority}) => {
  const dispatch = useDispatch();
  const projectId = task.project_id;
  const taskId = task.id;
  const {loggedUserId} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)

  const [newPriority, setNewPriority] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(priority ? priority.id : '');
  const [selectedPriorityName, setSelectedPriorityName] = useState(priority ? priority.name : '');
  const [selectedPriorityColor, setSelectedPriorityColor] = useState(priority && priority.color_code ? priority.color_code : '#000000');
  const [showPriorityList, setShowPriorityList] = useState(false);
  const [showPriorityAddInput, setShowPriorityAddInput] = useState(false);
  const selectPriorityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectPriorityRef.current && !selectPriorityRef.current.contains(event.target)) {
        setShowPriorityList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedPriority(priority ? priority.id : '');
    setSelectedPriorityName(priority ? priority.name : '');
    setSelectedPriorityColor(priority && priority.color_code ? priority.color_code : '#000000')
  }, [priority]);

  const handleInputChange = (e) => {
    setNewPriority(e.target.value);
  };

  const handleColorInputChange = (e) => {
    setNewPriorityColor(e.target.value);
  };

  const handlePriorityListShow = () => {
    setShowPriorityList(true);
  };

  const handleAddPriority = () => {
    if (newPriority.trim() !== '') {
      const submitData = {
        name: newPriority,
        project_id: projectId,
        color_code: newPriorityColor,
        created_by:loggedUserId
      }
      dispatch(createProjectPriority(submitData))
      setNewPriority('');
    }
    setShowPriorityAddInput(false);
  };

  const handleCreatePriority = () => {
    setShowPriorityAddInput(true);
  };

  const handleSelectPriority = (priority) => {
    if(taskId && taskId !== 'undefined' && priority){
      dispatch(editMyTask({id: taskId, data: {priority: priority, 'updated_by': loggedUserId}}))
    }
    setSelectedPriority(priority ? priority.id : '');
    setSelectedPriorityName(priority ? priority.name : '');
    setSelectedPriorityColor(priority && priority.color_code ? priority.color_code : '#000000');
    setShowPriorityAddInput(false);
    setShowPriorityList(false);
  };
  return (
    <Fragment>
      <div className="priority-wrapper">
        <div className="priority-btn cursor-pointer inline-flex" onClick={handlePriorityListShow}>
          {!selectedPriority ? (
            <div className="px-3 py-1 items-center gap-2 inline-flex">
              <IconMinus color="#4d4d4d" size="22" />
              <IconChevronDown color="#4d4d4d" size="22" />
            </div>
          ) : (
            <div style={{ backgroundColor: selectedPriorityColor }} className="flex px-2 py-0 rounded-[25px] items-center gap-2 inline-flex">
              <div className="text-white text-[14px]">{selectedPriorityName}</div>
              <IconChevronDown color="#ffffff" size="22" />
            </div>
          )}
        </div>

        {showPriorityList && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
          <div ref={selectPriorityRef} className="z-[9] selectpriority-list border rounded-lg bg-white shadow p-2 absolute">
            {task && task.project && task.project.projectPriorities.length>0 &&  task.project.projectPriorities.map((priority, index) => (
              <span
                className={`flex items-center w-full cursor-pointer text-[12px] p-1 ${
                  selectedPriority === priority.id ? 'bg-[#ebf1f4]' : 'hover:bg-[#ebf1f4]'
                }`}
                key={index}
                onClick={() => handleSelectPriority(priority)}
              >
                {selectedPriority === priority.id ? <IconCheck size="14" /> : null} {priority.name}
              </span>
            ))}

            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director']) &&
                <>
                  {showPriorityAddInput ? (
                      <div className="flex">
                        <input
                            className="w-full text-[12px]"
                            type="color"
                            value={newPriorityColor}
                            onChange={handleColorInputChange}
                            placeholder="Color"
                        />
                        <input
                            className="w-full text-[12px]"
                            type="text"
                            value={newPriority}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                        <button onClick={handleAddPriority}><IconCheck color="#4d4d4d" size="22" /></button>
                      </div>
                  ) : (
                      <span className="block cursor-pointer text-[12px] p-1 text-[#ED7D31]" onClick={handleCreatePriority}>+ Create Priority</span>
                  )}
                </>
            }
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default TaskPriority;
