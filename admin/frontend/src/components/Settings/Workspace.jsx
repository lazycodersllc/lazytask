import React, {Fragment, useEffect} from 'react';
import {Container, Grid, ScrollArea} from '@mantine/core';
import Header from '../Header'; 
import SettingsNav from './SettingsNav'; 
import CreateWorkspaceModal from '../Elements/Modal/Workspace/CreateWorkspaceModal'; 
import {useDispatch, useSelector} from "react-redux";
import {fetchAllCompanies} from "./store/companySlice";
import WorkspaceCard from "../Elements/WorkspaceCard";
import {hasPermission} from "../ui/permissions";
const Workspace = () => {
    const dispatch = useDispatch();
    const { loggedInUser } = useSelector((state) => state.auth.session)

    useEffect(() => {
        dispatch(fetchAllCompanies());
    }, [dispatch]);

    const {companies} = useSelector((state) => state.settings.company);
    
    return (
        <Fragment>
            <ScrollArea className="h-[calc(100vh-230px)] pb-[2px]" scrollbarSize={4}>
                <Grid gutter={{base: 20}} overflow="hidden" align="stretch" spacing="sm" verticalSpacing="sm">
                    {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin']) &&
                        <Grid.Col  span={{ base: 12, xs:6, sm:4, md: 3, lg: 3 }}>
                            <CreateWorkspaceModal />
                        </Grid.Col>
                    }

                    {Array.isArray(companies) &&
                        companies && companies.length>0 && companies.map((workspace, index) => (
                            <Grid.Col key={index} span={{ base: 12, xs:6, sm:4, md: 3, lg: 3 }}>
                                <WorkspaceCard key={index} {...workspace} />
                            </Grid.Col>
                        ))
                    }
                </Grid>
            </ScrollArea>
        </Fragment>
    );
}

export default Workspace;
