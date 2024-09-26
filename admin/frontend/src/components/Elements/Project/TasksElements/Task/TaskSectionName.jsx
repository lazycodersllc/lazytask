import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import React, {useRef, useState} from 'react';
import ContentEditable from 'react-contenteditable';
import { useSelector, useDispatch } from 'react-redux';
import {editTaskSection} from "../../../../Settings/store/taskSlice";
import {hasPermission} from "../../../../ui/permissions";

const TaskSectionName = ({ taskSectionId, nameOfTaskSection, view }) => {
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)

    const defaultTaskName = (nameOfTaskSection || "Type section name here")
    const contentEditableRef = useRef('');

    const [taskName, setTaskName] = useState(defaultTaskName);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = (e) => {
        setTaskName(e.target.value);
    };
    const handlerBlur = () => {
        const taskEditableName = contentEditableRef.current.innerHTML;
        if( taskSectionId && taskSectionId!=='undefined' && taskEditableName !== taskName){
            dispatch(editTaskSection({id: taskSectionId, data: {name: taskEditableName, updated_by: loggedUserId}}))
            setTaskName(taskEditableName);
        }
    };
    const previewTextLength = view === 'cardView' ? 17 : 70; // Adjust the number of characters to show
    const isLongText = taskName.length > previewTextLength;
    const previewText = isLongText ? taskName.slice(0, previewTextLength) + '...' : taskName;

    return (
        <div className={isFocused ? 'border border-solid border-[#000000] rounded-md min-w-[150px]' : 'cursor-pointer'}>
            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-edit']) ?
                <ContentEditable
                    innerRef={contentEditableRef}
                    html={isFocused ? taskName : previewText} // Inner HTML content
                    onChange={handleChange} // Handle changes
                    onBlur={()=>{
                        handlerBlur()
                        handleBlur()
                    }} // Handle changes
                    onFocus={handleFocus}
                    tagName="p" // Use a paragraph tag
                    className="text-[#4d4d4d] font-semibold text-[14px] px-1 !outline-none pr-1 leading-6"
                />
                :
                <p className="text-[#4d4d4d] font-semibold text-[14px] px-1 leading-6">{taskName}</p>
            }
        </div>
    );
};

export default TaskSectionName;
