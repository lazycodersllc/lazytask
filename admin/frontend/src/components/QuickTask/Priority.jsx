import { IconCheck, IconChevronDown, IconMinus } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
const Priority = ({ editPriorityHandler, projectPriorities, priority}) => {
  const dispatch = useDispatch();
  const [priorities, setPriorities] = useState(['Low', 'Medium', 'High']);
  const [newPriority, setNewPriority] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(priority ? priority.name : '');
  const [selectedPriorityName, setSelectedPriorityName] = useState(priority ? priority.name : '');
  const [selectedPriorityColor, setSelectedPriorityColor] = useState(priority && priority.color_code ? priority.color_code : '#000000');
  const [showPriorityList, setShowPriorityList] = useState(false);
  const [showPriorityAddInput, setShowPriorityAddInput] = useState(false);
  const selectPriorityRef = useRef(null);

  useEffect(() => {
    setSelectedPriority(priority ? priority.id : '');
    setSelectedPriorityName(priority ? priority.name : '');
    setSelectedPriorityColor(priority && priority.color_code ? priority.color_code : '#000000')
  }, [priority]);

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

  const handlePriorityListShow = () => {
    setShowPriorityList(true);
  };

  const handleSelectPriority = (priority) => {
    if(priority){
      editPriorityHandler(priority);
    }
    setSelectedPriority(priority ? priority.id : '');
    setSelectedPriorityName(priority ? priority.name : '');
    setSelectedPriorityColor(priority && priority.color_code ? priority.color_code : '#000000')
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
                {/*<Text c="white" size="sm" fw={400}>{selectedPriorityName}</Text>*/}
                <div className="text-white text-[14px]">{selectedPriorityName}</div>
                <IconChevronDown color="#ffffff" size="22"/>
              </div>
          )}
        </div>

        {showPriorityList && (
          <div ref={selectPriorityRef} className="selectpriority-list border rounded-lg bg-white shadow p-2 absolute min-w-[250px]">
            {projectPriorities && projectPriorities.length>0 &&  projectPriorities.map((priority, index) => (
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

          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Priority;
