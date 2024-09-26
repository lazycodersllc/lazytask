import React, {Fragment, useEffect} from 'react';
import {Button, Container, Grid, ScrollArea, Title} from '@mantine/core';
import Header from './Header';
import {useDispatch, useSelector} from "react-redux";
import {loggedInUserToken, onSignInSuccess, setToken} from "../store/auth/sessionSlice";

import {fetchTasksByUser} from "./Settings/store/myTaskSlice";
import {fetchQuickTasksByUser} from "./Settings/store/quickTaskSlice";
import {fetchAllTags} from "./Settings/store/tagSlice";
import QuickTaskList from "./Dashboard/QuickTaskList";
import TaskList from "./Dashboard/TaskList";
import DashboardBarChart from "./Dashboard/DashboardBarChart";
import ProjectSummery from "./Dashboard/ProjectSummery";

const Dashboard = () => {

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth.session);
    const {loggedUserId} = useSelector((state) => state.auth.user)

    useEffect(() => {
        setTimeout(() => {
            if(loggedUserId){
                dispatch(fetchTasksByUser({id:loggedUserId}))
                dispatch(fetchQuickTasksByUser({id:loggedUserId}))
            }
        }, 500);
    }, [dispatch, loggedUserId]);

    return (
        <Fragment>
            {/*<Header /> */}
            
            <div className='dashboard'>
                <Container size="full">
                    <div className="settings-page-card bg-white rounded-xl p-5 pt-3 my-5 mb-0">
                        <div className='mt-2 mb-3'>
                            {/*<h3 className="text-2xl font-semibold text-red-500 mb-4">Dashboard Content</h3>*/}
                            <Title order={4}>Dashboard</Title>
                        </div>
                        <ScrollArea scrollbars="y" className="w-full h-[calc(100vh-180px)] px-2" scrollbarSize={4}>
                            <Grid className="mb-5" columns={12}>
                                <Grid.Col span={3}>
                                    <QuickTaskList/>
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <ProjectSummery/>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <DashboardBarChart/>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={12}>
                                <Grid.Col span={4}>
                                    <TaskList slug='today' header='Today'/>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TaskList slug='nextSevenDays' header='Next 7 Days'/>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <TaskList slug='upcoming' header='Upcoming'/>
                                </Grid.Col>
                            </Grid>
                        </ScrollArea>
                    </div>
                </Container>
            </div>

            {/* <Footer /> */}
        </Fragment>

);
}

export default Dashboard;
