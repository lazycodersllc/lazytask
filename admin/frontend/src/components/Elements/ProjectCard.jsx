import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Text, Paper, Tooltip } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import EditProjectModal from './Modal/Project/EditProjectModal';
import DeleteProjectModal from './Modal/Project/DeleteProject';
import { NavLink } from 'react-router-dom';
import UsersAvatarGroup from "../ui/UsersAvatarGroup";
import CreateProjectModal from "./Modal/Project/CreateProjectModal";
import EditWorkspaceModal from "./Modal/Workspace/EditWorkspaceModal";
import DeleteWorkspaceModal from "./Modal/Workspace/DeleteWorkspace";
import {hasPermission} from "../ui/permissions";

const ProjectCard = (props) => {
    const {
        id,
        name,
        total_tasks,
        members,
        parent
    } = props;
    const { loggedInUser } = useSelector((state) => state.auth.session)

    // Filter usersData based on members IDs
    return (
        <Paper className="min-h-[193px]" radius="md" withBorder p="15px" bg="var(--mantine-color-body)" style={{ border: '1px solid #A4C0CB', width: '100%', height:'100%' }}>

            <Text ta="left" fz="md" fw={500} c="#202020">
                <NavLink to={`/project/task/list/${id}`}>
                    {name}
                </NavLink>
                {/*{name}*/}
            </Text>

            <div className="relative flex justify-between mt-1 mb-4">
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="4" fill="#F1975A"/>
                    </svg>
                    <Text ta="left" c="#4D4D4D" fz="xs">{members &&  members.length>0 ? members.length:0} users</Text>
                </div>
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="4" fill="#39758D"/>
                    </svg>
                    <Text ta="left" c="#4D4D4D" fz="xs">{total_tasks && total_tasks} tasks</Text>
                </div>
            </div>

            <UsersAvatarGroup users={members} size={40} maxCount={4} />

            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director']) &&
                <div className="flex justify-end gap-2.5 mt-4">
                    {/* <button className="text-center rounded-md border border-solid border-orange-500 px-2 py-1" onClick={onEditClick}>
                        <IconEdit size={20} color="#ED7D31" />
                    </button> */}
                    <EditProjectModal projectData={{ id, name, members, parent }} />
                    <DeleteProjectModal id={id} />
                </div>
            }
        </Paper>
    );
}

export default ProjectCard;
