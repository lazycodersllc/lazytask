import { IconCheck, IconChevronDown, IconMinus } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createProjectPriority, editTask} from "../../../../Settings/store/taskSlice";
import {useParams} from "react-router-dom";
import {hasPermission} from "../../../../ui/permissions";
import {Box, Button, ColorInput, Popover, Text, TextInput} from "@mantine/core";

const TaskPriority = ({ taskId, priority}) => {
  const dispatch = useDispatch();
  const id = useParams();
  const projectId = id.id;
  const {loggedUserId} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)

  const {projectPriorities} = useSelector((state) => state.settings.task);

  const [newPriority, setNewPriority] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState('#346A80');
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
        setShowPriorityAddInput(false);
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
    if (newPriority.trim() !== '' && newPriority !== 'Type name here') {
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
      dispatch(editTask({id: taskId, data: {priority: priority, 'updated_by': loggedUserId}}))
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
            <div className="px-1 py-1 items-center gap-2 inline-flex">
              <IconMinus color="#4d4d4d" size="22" />
              <IconChevronDown color="#4d4d4d" size="22" />
            </div>
          ) : (
            <div style={{ backgroundColor: selectedPriorityColor }} className="flex px-2 py-0 rounded-[25px] items-center gap-2 inline-flex">
              <Text c="white" size="sm" fw={400}>{selectedPriorityName}</Text>
              {/*<div className="text-white text-[14px]"></div>*/}
              <IconChevronDown color="#ffffff" size="22"/>
            </div>
          )}
        </div>

        {showPriorityList && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
          <div ref={selectPriorityRef} className="selectpriority-list border rounded-lg bg-white shadow p-2 absolute z-10 min-w-[250px]">
            {projectPriorities && projectPriorities.length>0 &&  projectPriorities.map((priority, index) => (
              <div
                className={`flex items-center gap-2 w-full cursor-pointer text-[12px] p-1 ${
                  selectedPriority === priority.id ? 'bg-[#ebf1f4]' : 'hover:bg-[#ebf1f4]'
                }`}
                key={index}
                onClick={() => handleSelectPriority(priority)}
              >
                {selectedPriority === priority.id ? <IconCheck size="14" /> : null}
                <Text c="black" size="xs" fw={400}>{ priority.name}</Text>
              </div>
            ))}

            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director']) &&
              <Box className={`border-t border-t-[#C8C8C8] pt-1.5 mt-2`}>
                {showPriorityAddInput ? (
                    <div className="flex items-center gap-1 py-1">
                      {/*<ColorInput
                          size="xs"
                          radius="md"
                          value={newPriorityColor}
                          onChange={handleColorInputChange}
                          withEyeDropper={false}
                      />*/}
                      <input
                          className="w-[30px] h-[30px] rounded-sm text-[12px]"
                          type="color"
                          value={newPriorityColor}
                          onChange={handleColorInputChange}
                          placeholder="Color"
                      />
                      <TextInput
                          size="xs"
                          className="w-full text-[12px]"
                          defaultValue={newPriority}
                          onChange={handleInputChange}
                          placeholder={'Type name here'}
                      />

                      <Button onClick={handleAddPriority} className={`!px-1 !py-2.5`} variant={newPriority.length>0?'filled':'default'} color="orange" size={`xs`} >
                        <IconCheck color={newPriority.length>0?'white':'gray'} size="24" stroke={1.5} />
                      </Button>
                      {/*<button className={`border rounded-md w-[35px] h-[30px]`} onClick={handleAddPriority}><IconCheck color="#4d4d4d" size="22" /></button>*/}
                    </div>
                ) : (
                    <span className="block cursor-pointer text-[12px] p-1 text-[#ED7D31] " onClick={handleCreatePriority}>+ Create Priority</span>
                )}
              </Box>
            }


          </div>
        )}
      </div>
    </Fragment>
  );
};

export default TaskPriority;
