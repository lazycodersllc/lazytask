import { IconUserCircle } from '@tabler/icons-react';
import React, {useState, useRef, useEffect, Fragment} from 'react';
import { Avatar, ScrollArea, Text } from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {editTask, setEditableTask} from "../../../../Settings/store/taskSlice";
import {hasPermission} from "../../../../ui/permissions";
import acronym from "../../../../ui/acronym";
import useTwColorByName from "../../../../ui/useTwColorByName";
import UserAvatarSingle from "../../../../ui/UserAvatarSingle";
const TaskAssignTo = ({ taskId, assigned, view, assignedMember= {}}) => {
    const dispatch = useDispatch();

    const {boardMembers} = useSelector((state) => state.settings.task);
    const [showMembersList, setShowMembersList] = useState(false);
    const [members, setMembers] = useState(boardMembers? boardMembers: []);
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
        setMembers((prevMembers) =>
            prevMembers.map((m) => {
                if (m.id === member.id) {
                    return { ...m, assigned: !m.assigned }; // Toggle assigned status
                } else if (selectedMember && m.id === selectedMember.id) {
                    return { ...m, assigned: false }; // Unassign previously selected member
                } else {
                    return m;
                }
            })
        );

        assignedMember(member);
    
        setSelectedMember(member);
        setShowMembersList(false);
        if (taskId && taskId !== 'undefined' && member) {
            dispatch(editTask({id: taskId, data: {assigned_to: member, 'updated_by': loggedUserId}}))
        }
    };
    const bgColor = useTwColorByName();

    return (
        <Fragment>
            <div onClick={handleAssignedToButtonClick} className="assignto-btn">
                {selectedMember ? (
                    <div className="flex items-center gap-2">
                        <Avatar
                            color={ `${bgColor(selectedMember.name)["font-color"]}` }
                            bg={ `${bgColor(selectedMember.name)["bg-color"]}` }
                            size={32}
                            radius={32}
                            src={selectedMember.avatar?selectedMember.avatar:null}

                        >
                            { selectedMember.avatar ? '' : <Text style={{ lineHeight:"14px"}} size="xs">{acronym(selectedMember.name)}</Text> }
                        </Avatar>
                        {/*<Avatar src={selectedMember.avatar} size={32} radius={32}/>*/}
                        {!(view === 'cardView') && (
                            // <p className="ml-2">{selectedMember.name}</p>
                            <Text title={selectedMember.name} lineClamp={1} size="sm" fw={500} c="#202020" className="ml-2">
                                {selectedMember.name}
                            </Text>
                        )}
            </div>
            ) : (
                <div className="h-[30x] w-[30px] border border-dashed border-[#202020] rounded-full p-1 cursor-pointer">
                    <IconUserCircle color="#4d4d4d" size="20" stroke={1.25} />
                </div>
                )
                }
            </div>

            {showMembersList && hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) && (
                <div
                    ref={membersListRef}
                    className="shadow-lg members-lists absolute w-[368px] bg-white mt-1 border border-solid border-[#ffffff] rounded-lg z-[9]"
                > 
                    <ScrollArea h={272}>
                        <div className="p-3">
                            <Text size="sm" fw={700} c="#202020">
                                {boardMembers && boardMembers.length>0 ? boardMembers.length: 0 } people available
                            </Text>
                            <div className="mt-3">
                                {boardMembers && boardMembers.length>0 && boardMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-1 justify-between"
                                    >
                                        {/*<Avatar src={member.avatar} size={32} radius={32} />*/}
                                        <UserAvatarSingle user={member} size={32} />
                                        <div className="mls-ne ml-3 w-[80%]">
                                            <Text size="sm" fw={700} c="#202020">
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
