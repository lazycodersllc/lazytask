import { IconCheck, IconChevronDown, IconMinus } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {editTask} from "../../../../Settings/store/taskSlice";

const Priority = ({ editPriorityHandler, priority}) => {
  const dispatch = useDispatch();
  const {projectPriorities} = useSelector((state) => state.settings.task);
  const [priorities, setPriorities] = useState(['Low', 'Medium', 'High']);
  const [newPriority, setNewPriority] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(priority ? priority.name : '');
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

  const handleInputChange = (e) => {
    setNewPriority(e.target.value);
  };

  const handlePriorityListShow = () => {
    setShowPriorityList(true);
  };

  const handleAddPriority = () => {
    if (newPriority.trim() !== '') {
      // setPriorities([...priorities, newPriority]);
      setNewPriority('');
      setShowPriorityAddInput(false);
    }
  };

  const handleCreatePriority = () => {
    setShowPriorityAddInput(true);
  };

  const handleSelectPriority = (priority) => {
    if(priority){
      editPriorityHandler(priority);
    }
    setSelectedPriority(priority ? priority.name : '');
    setShowPriorityAddInput(false);
    setShowPriorityList(false);
  };

  return (
    <Fragment>
      <div className="priority-wrapper">
        <div className="priority-btn cursor-pointer inline-flex" onClick={handlePriorityListShow}>
          {!selectedPriority ? (
            <div className="px-4 py-1 items-center gap-2 inline-flex">
              <IconMinus color="#4d4d4d" size="22" />
              <IconChevronDown color="#4d4d4d" size="22" />
            </div>
          ) : (
            <div className="flex bg-black px-4 py-1 rounded-[25px] items-center gap-2 inline-flex">
              <div className="text-white text-[14px]">{selectedPriority}</div>
              <IconChevronDown color="#ffffff" size="22" />
            </div>
          )}
        </div>

        {showPriorityList && (
          <div ref={selectPriorityRef} className="selectpriority-list border rounded-lg bg-white shadow p-2 absolute">
            {projectPriorities && projectPriorities.length>0 &&  projectPriorities.map((priority, index) => (
              <span
                className={`flex items-center w-full cursor-pointer text-[12px] p-1 ${
                  selectedPriority === priority.name ? 'bg-[#ebf1f4]' : 'hover:bg-[#ebf1f4]'
                }`}
                key={index}
                onClick={() => handleSelectPriority(priority)}
              >
                {selectedPriority === priority.name ? <IconCheck size="14" /> : null} {priority.name}
              </span>
            ))}

            {showPriorityAddInput ? (
              <div className="flex">
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
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Priority;
