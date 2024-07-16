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
const Settings = () => {
    // const users = useSelector((state) => state.users);
    const { allMembers } = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
  
    useEffect(() => {
      // Dispatch an action to set users data when the component mounts
        dispatch(fetchAllMembers())
      dispatch(setUsers(allMembers));
    }, [dispatch]);
    // console.log(usersData);
  return (
    <Fragment>
      <Header />
      <div className="dashboard">
        <Container size="full">
            <div className="settings-page-card bg-white rounded-xl p-6 pt-3 my-5 mb-0">
                <SettingsNav/>
                <ScrollArea className="h-[calc(100vh-300px)] pb-[2px]" scrollbarSize={4}>
                    <Grid gutter={{base: 20}} overflow="hidden" align="stretch" spacing="sm" verticalSpacing="sm">
                        {/*<Grid.Col  span={{ base: 12, xs:4, sm:3, md: 3, lg: 3 }}>
                            <ProfileCreateButton />
                        </Grid.Col>*/}
                        {Array.isArray(allMembers) &&
                            allMembers && allMembers.length>0 && allMembers.map((user, index) => (
                                <Grid.Col key={index} span={{ base: 12, xs:4, sm:3, md: 3, lg: 3 }}>
                                    <UserCard key={index}  {...user} />
                                </Grid.Col>
                            ))
                        }
                    </Grid>

                </ScrollArea>
                
            </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Settings;
