import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Breadcrumbs,
    Button,
    Dialog,
    Flex,
    Group, List,
    Popover,
    ScrollArea,
    Text,
    Title,
    Tooltip
} from '@mantine/core';
import {useLocation, NavLink, Link, useParams, useNavigate} from 'react-router-dom';
import {
    IconArrowLeft, IconCaretDownFilled, IconCheck,
    IconChevronDown,
    IconChevronRight,
    IconChevronsRight,
    IconFilter,
    IconPlus,
    IconX
} from '@tabler/icons-react';
import UsersAvatarGroup from "../../ui/UsersAvatarGroup";
import {editProject} from "../../Settings/store/projectSlice";
import {fetchTasksByProject, updateBoardMembers} from "../../Settings/store/taskSlice";
import {hasPermission} from "../../ui/permissions";
const ProjectDetailsNav = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const {loggedUserId} = useSelector((state) => state.auth.user);
    const { loggedInUser } = useSelector((state) => state.auth.session)

    const usersData = useSelector((state) => state.users);
    const {boardMembers, projectInfo } = useSelector((state) => state.settings.task);

    const dispatch = useDispatch();
    const {id} = useParams();

    const listPagePathName = `/project/task/list/${id}`;
    const boardPagePathName = `/project/task/board/${id}`;
    const calendarPagePathName = `/project/task/calendar/${id}`;

    const [selectedMembers, setSelectedMembers] = useState(boardMembers || []);

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

        if (id && id !== 'undefined' && updatedMembers) {
            dispatch(editProject({id: id, data: {'members': updatedMembers, 'updated_by': loggedUserId}}));
            dispatch(updateBoardMembers(updatedMembers));
        }
    };

    useEffect(() => {
        setSelectedMembers(boardMembers || []);
    }, [projectInfo]);

    const goToTasksList = (id) => {
        dispatch(fetchTasksByProject({id:id}))
        navigate(`/project/task/list/${id}`)
    }

    return (
        <>
            <div className="relative flex justify-between items-center">
                {/*<h2 className="text-2xl font-semibold">
                    {projectInfo && projectInfo.name}
                </h2>*/}
                <div className='mt-2 mb-3'>
                    <Breadcrumbs separator={<IconChevronRight size={20} stroke={1.25} />}  separatorMargin="xs">
                        <Title order={4}>
                            {projectInfo && projectInfo.parent && projectInfo.parent.name}
                        </Title>
                        <Popover width={300} position="bottom-start" withArrow shadow="md">
                            <Popover.Target>
                                <Flex className={`min-w-[200px] !justify-between border px-2 py-1 rounded-md cursor-pointer`}
                                      gap="md"
                                      justify={"space-between"}
                                      align="center">
                                    <Title order={4}>
                                        {projectInfo && projectInfo.name}

                                    </Title>
                                    <IconCaretDownFilled size={20} />
                                </Flex>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <ScrollArea h={350} offsetScrollbars scrollbarSize={6}>
                                    <List classNames={{
                                        root: '!bg-white !rounded-b-md',
                                        itemWrapper: '!w-full',
                                        itemLabel: '!w-full',
                                        // item: '!py-2 !px-4',
                                        // label: '!py-2 !px-4',
                                    }}>
                                        {projectInfo && projectInfo.parent && projectInfo.parent.projects && projectInfo.parent.projects.length > 0 && projectInfo.parent.projects.map((project, index) => (
                                            <List.Item

                                                key={`${project.id}-${index}`}
                                                style={{"lineHeight":"normal"}}
                                                className="flex text-[#346A80] hover:bg-[#EBF1F4] cursor-pointer !py-2 !px-4"
                                                onClick={() => goToTasksList(project.id)}>
                                                <div className={`flex items-center w-full`}>
                                                    <p className={`w-full ${location && (location.pathname === '/project/task/list/'+project.id ||  location.pathname === '/project/task/board/'+project.id || location.pathname === '/project/task/calendar/'+project.id ) ? 'font-semibold text-black':'text-[#346A80]'}`}>
                                                        {project.name}
                                                    </p>
                                                    {location && (location.pathname === '/project/task/list/'+project.id || location.pathname === '/project/task/board/'+project.id || location.pathname === '/project/task/calendar/'+project.id ) &&
                                                        <IconCheck color={`#000000`} size={20} stroke={1.25} />
                                                    }
                                                </div>
                                            </List.Item>

                                        ))}

                                    </List>
                                </ScrollArea>

                            </Popover.Dropdown>
                        </Popover>

                    </Breadcrumbs>
                </div>
                {/*<Link to="/project" className="text-gray-600 hover:text-gray-800 focus:shadow-none">
                    <IconX size={24} color="#202020"/>
                </Link>*/}
            </div>

            <div className="relative flex justify-between items-center">
                <div className="relative flex mb-3 space-x-3">
                    <NavLink to={`/project/task/list/${id}`} className="nav-link" activeClassName="active-link">
                        <Button 
                            size="sm"
                            color={location.pathname === listPagePathName ? "#39758D" : "#EBF1F4"}
                            styles={{
                                label: {
                                    color: location.pathname === listPagePathName ? "#fff" : "#000"
                                }
                            }}
                        >
                            List
                        </Button>
                    </NavLink>
                    <NavLink to={`/project/task/board/${id}`} className="nav-link" activeClassName="active-link">
                        <Button 
                            size="sm"
                            color={location.pathname === boardPagePathName ? "#39758D" : "#EBF1F4"}
                            styles={{
                                label: {
                                    color: location.pathname === boardPagePathName ? "#fff" : "#000"
                                }
                            }}
                        >
                            Board
                        </Button>
                    </NavLink>
                    <NavLink to={`/project/task/calendar/${id}`} className="nav-link" activeClassName="active-link">
                        <Button
                            size="sm"
                            color={location.pathname === calendarPagePathName ? "#39758D" : "#EBF1F4"}
                            styles={{
                                label: {
                                    color: location.pathname === calendarPagePathName ? "#fff" : "#000"
                                }
                            }}
                        >
                            Calendar
                        </Button>
                    </NavLink>
                    <NavLink to="" className="nav-link" activeClassName="active-link">
                        <Button size="sm" color={"#EBF1F4"} styles={{label: { color: "#c2c2c2" } }} disabled>
                            Gantt chart
                        </Button>
                    </NavLink>
                    <NavLink to="" className="nav-link" activeClassName="active-link">
                        <Button size="sm" color={"#EBF1F4"} styles={{label: { color: "#c2c2c2" } }} disabled>
                            Swimlane
                        </Button>
                    </NavLink>
                </div>

                <div className="relative filterandusers flex items-center gap-4 mb-3">
                    <Button 
                        variant="filled" 
                        color="#39758D"
                        style={{
                            width: '40px',
                            padding: '5px', 
                        }}
                        >
                        <IconFilter />
                    </Button>
                    <div className="flex gap-1">
                        <UsersAvatarGroup users={boardMembers} size={40} maxCount={50} />
                        {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director','manager']) &&
                            <Popover height={150}  position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Tooltip label="Add Member">
                                        <Avatar
                                            // onClick={onAddMember}
                                            size={40}
                                            bg="#ED7D31"
                                            color="#fff"
                                        >
                                            <IconPlus className=' hover:scale-110' size={20}/>
                                        </Avatar>
                                    </Tooltip>
                                </Popover.Target>
                                <Popover.Dropdown>

                                    <ScrollArea className="h-[290px] min-w-[368px]" scrollbarSize={5}>
                                        <div className="p-0">
                                            <Text size="sm" fw={700} c="#202020">{projectInfo.parent && projectInfo.parent.members && projectInfo.parent.members.length>0 ? projectInfo.parent.members.length: 0 } people available</Text>
                                            <div className="mt-2">
                                                {projectInfo.parent && projectInfo.parent.members && projectInfo.parent.members.length > 0 && projectInfo.parent.members.map((member) => (
                                                    <div key={member.id} className="ml-single flex items-center border-b border-solid border-[#ffffff] py-1 justify-between">
                                                        <Avatar src={member.avatar} size={40} radius={32} />
                                                        <div className="mls-ne ml-3 w-[80%]">
                                                            <Text size="sm" fw={700} c="#202020">{member.name}</Text>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAssignButtonClick(member)}
                                                            className={`rounded-[5px] h-[32px] px-2 py-0 w-[100px] ml-2 ${selectedMembers.some((selectedMember) => parseInt(selectedMember.id) === parseInt(member.id)) ? 'bg-[#f00]' : 'bg-[#39758D]'}`}
                                                        >
                                                            <Text size="sm" fw={400} c="#fff">
                                                                {selectedMembers.some((selectedMember) => parseInt(selectedMember.id) === parseInt(member.id) ) ? 'Remove' : 'Assign'}
                                                            </Text>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </ScrollArea>

                                </Popover.Dropdown>
                            </Popover>
                        }
                    </div>

                </div>
            </div>
            
        </>
        
    );
}

export default ProjectDetailsNav;
