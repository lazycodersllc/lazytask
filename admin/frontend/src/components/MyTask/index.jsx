import React, {Fragment, useEffect, useState} from 'react';
import {Button, Container, Grid, LoadingOverlay, ScrollArea, Tabs, Title} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import Header from "../Header";
import {fetchAllTags} from "../Settings/store/tagSlice";
import MyTaskList from "./MyTaskList";
import {fetchTasksByUser, setLoggedInUserId} from "../Settings/store/myTaskSlice";
import {useDisclosure} from "@mantine/hooks";
import QuickTaskList from "./QuickTaskList";
import {fetchQuickTasksByUser} from "../Settings/store/quickTaskSlice";
import {IconMessageCircle, IconPhoto, IconSettings} from "@tabler/icons-react";
import TaskHeader from "./Partial/TaskHeader";

const MyTask = () => {
    const [visible, { toggle }] = useDisclosure(true);

    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)

    useEffect(() => {
        setTimeout(() => {
            if(loggedUserId){
                dispatch(fetchTasksByUser({id:loggedUserId}))
                dispatch(fetchQuickTasksByUser({id:loggedUserId}))
                dispatch(fetchAllTags())
                dispatch(setLoggedInUserId(loggedUserId))
            }
        }, 500);
    }, [dispatch, loggedUserId]);


    return (
        <Fragment>
            {/*<Header />*/}
            
            <div className='dashboard'>
                <Container size="full">
                    <div className="settings-page-card bg-white rounded-xl p-6 pt-3 my-5 mb-0">
                        <div className='mt-2 mb-3'>
                            <Title order={4}>My Task</Title>
                        </div>
                        <Grid columns={12}>
                            <Grid.Col span={9}>
                                <div className="w-full bg-white">
                                    <MyTaskList/>
                                </div>

                            </Grid.Col>
                            <Grid.Col span={3}>
                                <QuickTaskList/>
                            </Grid.Col>
                        </Grid>
                    </div>
                </Container>
            </div>

        </Fragment>

    );
}

export default MyTask;
