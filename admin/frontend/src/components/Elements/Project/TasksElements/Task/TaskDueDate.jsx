import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from '@mantine/dates';
import { IconCalendarEvent } from '@tabler/icons-react';
import '@mantine/dates/styles.css';
import {useDispatch, useSelector} from "react-redux";
import {editTask} from "../../../../Settings/store/taskSlice";
import dayjs from "dayjs";
import {hasPermission} from "../../../../ui/permissions";

const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const dbdateFormate = (date) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  let formattedDate = new Date(date).toLocaleDateString('en-US', options);

  // Remove the comma after the day
  formattedDate = formattedDate.replace(',', '');

  const [month, day, year] = formattedDate.split(' ');
  return `${day}-${month}-${year}`;
};

 


const inputDate = new Date("2024-02-05");
const options = { day: 'numeric', month: 'short', year: 'numeric' };
const formattedDate = inputDate.toLocaleDateString('en-US', options);

// console.log(formattedDate); // Output: 5-Feb-2024


const TaskDueDate = ({ taskId, dueDate}) => {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const calendarRef = useRef(null);
  const {loggedUserId} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)


  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (date) => {
    if(taskId && taskId !== 'undefined' && date){
      var formatedDate = dayjs(date).format('YYYY-MM-DD');
      dispatch(editTask({id: taskId, data: {start_date: formatedDate, end_date: formatedDate, 'updated_by': loggedUserId }}))
    }
    setSelectedDate(date);
    setCalendarVisible(false); // Hide calendar after selecting a date 
     
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setCalendarVisible(false); // Hide calendar when clicking outside of it
    }
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleCalendarClick = (event) => {
    event.stopPropagation(); // Prevents the click event from bubbling up to the parent
  };

  return (
    <div className="due-select-btn" onClick={toggleCalendar}>
      {selectedDate ? (
          <div className="due-selected text-[#202020] font-medium text-[14px] cursor-pointer">
              {formatDate(selectedDate)} {/* Render formatted date */}
          </div>
      ) : (
          dueDate === null ? (
              <div className="h-[30px] w-[30px] border border-dashed border-[#202020] rounded-full p-1 cursor-pointer">
                  <IconCalendarEvent color="#4d4d4d" size="20" stroke={1.25} />
              </div>
          ) : (
              <div className="due-selected text-[#202020] font-medium text-[14px] cursor-pointer">
                  {dbdateFormate(dueDate)}
              </div>
          )
      )}

      {calendarVisible && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
        <div ref={calendarRef} className="absolute bg-white border border-solid border-[#6191A4] rounded-sm p-2 z-[9]" onClick={handleCalendarClick}>
          <Calendar
            getDayProps={(date) => ({ 
              onClick: () => handleSelect(date),
            })}
          />
        </div>
      )}
    </div>
  );
};

export default TaskDueDate;
