import { IconUsers } from '@tabler/icons-react';
import React, { useState, useRef, useEffect } from 'react'; 
import { Avatar, ScrollArea, Text, Tooltip } from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import UsersAvatarGroup from "../../ui/UsersAvatarGroup";
import {editMyTask} from "../../Settings/store/myTaskSlice";
import {hasPermission} from "../../ui/permissions";
const TaskFollower = ({ task, followers }) => {
    const dispatch = useDispatch();
    const taskId = task.id;
    const [boardMembers, setBoardMembers] = useState(task && task.project && task.project.members && task.project.members.length>0 ? task.project.members: []);
    const [showMembersList, setShowMembersList] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState(followers || []);
    const membersListRef = useRef(null);
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)


    // console.log(followers); 
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
        // Toggle between assigning and removing a member
        var updatedMembers = [];
        const index = selectedMembers.findIndex((selectedMember) => parseInt(selectedMember.id) === parseInt(member.id));
        if (index === -1) {
            const assignAfterMembers = [...selectedMembers, member];
            updatedMembers = assignAfterMembers;

            setSelectedMembers(assignAfterMembers);
        } else {
            const deletedAfterMembers = selectedMembers.filter((selectedMember) => parseInt(selectedMember.id) !== parseInt(member.id));
            updatedMembers = deletedAfterMembers;

            setSelectedMembers(deletedAfterMembers);
        }

        if (taskId && taskId !== 'undefined' && updatedMembers) {
            dispatch(editMyTask({id: taskId, data: {members: updatedMembers, 'updated_by': loggedUserId}}))
        }
    };

    useEffect(() => {
        setSelectedMembers(followers || []);
        setBoardMembers(task && task.project && task.project.members && task.project.members.length>0 ? task.project.members: [])
    }, [followers, task]);

    return (
        <>
            <div className="assignto-btn flex items-center">
                {selectedMembers && selectedMembers.length > 0 ? (
                    <div onClick={handleAssignedToButtonClick} className="flex-inline items-center cursor-pointer">
                        <UsersAvatarGroup users={selectedMembers} size={36} maxCount={3}/>
                    </div>
                ) : (
                    <div onClick={handleAssignedToButtonClick}
                         className="h-[30px] w-[30px] border border-dashed border-[#4d4d4d] rounded-full p-1 cursor-pointer">
                        <IconUsers color="#4d4d4d" size="20" stroke={1.25}/>
                    </div>
                )}
            </div>


            {showMembersList && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
                <div ref={membersListRef}
                     className="shadow-lg z-[9] members-lists absolute w-[368px] bg-white mt-1 border border-solid border-[#ffffff] rounded-lg">
                    <ScrollArea h={272}>
                        <div className="p-3">
                            <Text size="sm" fw={700}
                                  c="#202020">{boardMembers.length > 0 ? boardMembers.length : 0} people
                                available</Text>
                            <div className="mt-3">
                                {boardMembers.length > 0 && boardMembers.map((member) => (
                                    <div key={member.id}
                                         className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-1 justify-between">
                                        <Avatar src={member.avatar} size={32} radius={32}/>
                                        <div className="mls-ne ml-3 w-[80%]">
                                            <Text size="sm" fw={700} c="#202020">{member.name}</Text>
                                        </div>
                                        <button
                                            onClick={() => handleAssignButtonClick(member)}
                                            className={`rounded-[5px] h-[32px] px-2 py-0 w-[100px] ml-2 ${selectedMembers.some((selectedMember) => parseInt(selectedMember.id) === parseInt(member.id)) ? 'bg-[#f00]' : 'bg-[#39758D]'}`}
                                        >
                                            <Text size="sm" fw={400} c="#fff">
                                                {selectedMembers.some((selectedMember) => parseInt(selectedMember.id) === parseInt(member.id)) ? 'Remove' : 'Assign'}
                                            </Text>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>


            )}
        </>
    );
};

export default TaskFollower;
