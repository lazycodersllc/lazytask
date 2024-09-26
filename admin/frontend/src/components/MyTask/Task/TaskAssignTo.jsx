import { IconUserCircle } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import { Avatar, ScrollArea, Text } from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {editMyTask} from "../../Settings/store/myTaskSlice";
import {hasPermission} from "../../ui/permissions";
import UserAvatarSingle from "../../ui/UserAvatarSingle";
const TaskAssignTo = ({ task, assigned }) => {
    const dispatch = useDispatch();

    const [showMembersList, setShowMembersList] = useState(false);
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)

    const [selectedMember, setSelectedMember] = useState((assigned && assigned.id) ? assigned : null);
    const membersListRef = useRef(null);

    useEffect(() => {
        setSelectedMember(assigned && assigned.id ? assigned : null);
    }, [assigned]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (membersListRef.current && !membersListRef.current.contains(event.target)) {
                setShowMembersList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [membersListRef]);

    const handleAssignedToButtonClick = () => {
        setShowMembersList(true);
    };

    const handleAssignButtonClick = (member) => {

        setSelectedMember(member);
        setShowMembersList(false);
        if (task && task.id && task.id !== 'undefined' && member) {
            dispatch(editMyTask({id: task.id, data: {assigned_to: member, 'updated_by': loggedUserId}}))
        }
    };

    return (
        <Fragment>
            <div onClick={handleAssignedToButtonClick} className="assignto-btn">
                {selectedMember ? (
                    <div className="flex items-center gap-2">
                        {/*<Avatar src={selectedMember.avatar} size={32} radius="xl" />*/}
                        <UserAvatarSingle user={selectedMember} size={32} />
                        <Text title={selectedMember.name} lineClamp={1} size="sm" fw={600} c="#4d4d4d" className="ml-2">
                            {selectedMember.name}
                        </Text>
                    </div>
                ) : (
                    <div className="h-[32px] w-[32px] border border-dashed border-[#4d4d4d] rounded-full p-1 cursor-pointer">
                        <IconUserCircle color="#4d4d4d" size="22" />
                    </div>
                )}
            </div>

            {showMembersList && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
                <div
                    ref={membersListRef}
                    className="shadow-lg members-lists absolute w-[368px] bg-white mt-1 border border-solid border-[#ffffff] rounded-lg z-[9]"
                > 
                    <ScrollArea h={272}>
                        <div className="p-3">
                            <Text size="sm" fw={700} c="#202020">
                                {task && task.project && task.project.members ? task.project.members.length : 0 } people available
                            </Text>
                            <div className="mt-3">
                                {task && task.project && task.project.members && task.project.members.length>0 && task.project.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-1 justify-between"
                                    >
                                        <UserAvatarSingle user={member} size={32} />

                                        {/*<Avatar src={member.avatar} size={40} radius="xl" />*/}
                                        <div className="mls-ne ml-3 w-[80%]">
                                            <Text className="font-semibold text-[14px]" size="sm" fw={700} c="#202020">
                                                {member.name}
                                            </Text>
                                        </div>
                                        <button
                                            onClick={() => handleAssignButtonClick(member)}
                                            className="rounded-[5px] h-[32px] px-1 py-0 w-[100px] ml-2 bg-[#39758D]"
                                        >
                                            <Text size="sm" fw={400} c="#fff">
                                                {selectedMember && selectedMember.id === member.id ? 'Assigned' : 'Assign'}
                                            </Text>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </Fragment>
    );
};

export default TaskAssignTo;
