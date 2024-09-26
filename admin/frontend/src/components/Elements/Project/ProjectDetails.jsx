import React, {Fragment, useEffect, useState} from 'react';
import {Button, Container, LoadingOverlay, ScrollArea} from '@mantine/core';
import Header from '../../Header';
import ProjectDetailsNav from './ProjectDetailsNav';
import ProjectDetailsList from './ProjectDetailsList';
import ProjectDetailsBorad from './ProjectDetailsBorad';
import {useLocation, useParams} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {fetchTasksByProject} from "../../Settings/store/taskSlice";
import {fetchAllTags} from "../../Settings/store/tagSlice";
import ProjectDetailsCalendar from "./ProjectDetailsCalendar";
const ProjectDetails = () => { 
    const location = useLocation();
    const dispatch = useDispatch();
    const {id}= useParams();

    useEffect(() => {
        dispatch(fetchTasksByProject({id:id}))
        dispatch(fetchAllTags())
    }, [dispatch]);

    const listPagePathName = `/project/task/list/${id}`;
    const boardPagePathName = `/project/task/board/${id}`;
    const calendarPagePathName = `/project/task/calendar/${id}`;

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        }, 1000);
    }, [location.pathname]);

    return (
        <Fragment>
            {/*<Header /> */}
            <div className='dashboard'> 
                <Container size="full">
                    <div className="settings-page-card bg-white rounded-xl p-6 pt-3 my-5 mb-0">
                        <ProjectDetailsNav />
                        <LoadingOverlay
                            visible={visible}
                            zIndex={1000}
                            overlayProps={{ radius: 'sm', blur: 4 }}
                        />
                        {location.pathname === listPagePathName && <ProjectDetailsList />}
                        {location.pathname === boardPagePathName && <ProjectDetailsBorad />}
                        {location.pathname === calendarPagePathName && <ProjectDetailsCalendar />}
                    </div>
                </Container>
            </div>   
        </Fragment>
        
    );
}

export default ProjectDetails;
