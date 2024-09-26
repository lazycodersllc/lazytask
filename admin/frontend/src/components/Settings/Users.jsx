import React, {Fragment, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Container, Grid, ScrollArea} from '@mantine/core';
import Header from '../Header';
import { setUsers } from '../../reducers/usersSlice';
import UserCard from '../Elements/UserCard';
import SettingsNav from './SettingsNav';
import ProfileCreateButton from "../Elements/Button/ProfileCreateButton";
import {fetchAllMembers} from "../../store/auth/userSlice";
import CreateProjectModal from "../Elements/Modal/Project/CreateProjectModal";
import ProjectCard from "../Elements/ProjectCard";
import {hasPermission} from "../ui/permissions";
const Users = () => {
    // const users = useSelector((state) => state.users);
    const { loggedInUser } = useSelector((state) => state.auth.session)

    const { allMembers } = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
  
    useEffect(() => {
      // Dispatch an action to set users data when the component mounts
        dispatch(fetchAllMembers())
        if(allMembers && allMembers.length>0){
            dispatch(setUsers(allMembers));
        }
    }, [dispatch]);
    // console.log(usersData);
  return (
    <Fragment>
        <ScrollArea className="h-[calc(100vh-230px)] pb-[2px]" scrollbarSize={4}>
            <Grid gutter={{base: 20}} overflow="hidden" align="stretch" spacing="sm" verticalSpacing="sm">
                {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director']) &&
                    <Grid.Col  span={{ base: 12, xs:4, sm:3, md: 3, lg: 3 }}>
                        <ProfileCreateButton />
                    </Grid.Col>
                }
                {Array.isArray(allMembers) &&
                    allMembers && allMembers.length>0 && allMembers.map((user, index) => (
                        <Grid.Col key={index} span={{ base: 12, xs:4, sm:3, md: 3, lg: 3 }}>
                            <UserCard key={index}  {...user} />
                        </Grid.Col>
                    ))
                }
            </Grid>

        </ScrollArea>
    </Fragment>
  );
};

export default Users;
