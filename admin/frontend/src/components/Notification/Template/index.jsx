import React, {Fragment, useEffect} from 'react';
import {Avatar, Button, Card, Container, Grid, Group, Modal, ScrollArea, Tabs, Title} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import Header from "../../Header";
import {
    fetchAllNotificationChannels,
    fetchAllNotificationTemplates,
    fetchNotificationActions
} from "../store/notificationTemplateSlice";
import TemplateListContent from "./TemplateListContent";
import {IconPlus} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import CreateTemplateModal from "./CreateTemplateModal";
import SettingsNav from "../../Settings/SettingsNav";
import SMTPConfiguration from "./SMTPConfiguration";
import SMSConfiguration from "./SMSConfiguration";

const NotificationTemplate = () => {

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth.session);
    const {loggedUserId} = useSelector((state) => state.auth.user)

    useEffect(() => {
        dispatch(fetchAllNotificationTemplates());
        dispatch(fetchAllNotificationChannels());
        dispatch(fetchNotificationActions())
    }, [dispatch]);



    return (
        <Fragment>
            {/*<Header /> */}
            
            <div className='dashboard'>
                <Container size="full">
                    <div className="settings-page-card bg-white rounded-xl p-5 pt-3 my-5 mb-0">
                        <SettingsNav />

                        <ScrollArea scrollbars="y" className="w-full h-[calc(100vh-210px)] pr-1" scrollbarSize={4}
                                    offsetScrollbars={true}>

                            <Tabs color="orange" orientation="vertical" defaultValue="template-list">
                                <Tabs.List>
                                    <Tabs.Tab value="template-list" >
                                        Template List
                                    </Tabs.Tab>
                                    <Tabs.Tab value="smtp-configuration" >
                                        SMTP Configuration
                                    </Tabs.Tab>
                                    <Tabs.Tab value="sms-configuration" >
                                        SMS Configuration
                                    </Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel value="template-list" px={'md'}>
                                    <Grid className="mb-5" columns={12}>
                                        <Grid.Col span={12}>
                                            <TemplateListContent/>
                                        </Grid.Col>
                                    </Grid>
                                </Tabs.Panel>
                                <Tabs.Panel value="smtp-configuration" px={'md'}>
                                    <Grid className="mb-5" columns={12}>
                                        <Grid.Col span={12}>
                                            <SMTPConfiguration />
                                        </Grid.Col>
                                    </Grid>
                                </Tabs.Panel>
                                <Tabs.Panel value="sms-configuration" px={'md'}>
                                    <Grid className="mb-5" columns={12}>
                                        <Grid.Col span={12}>
                                            <SMSConfiguration />
                                        </Grid.Col>
                                    </Grid>
                                </Tabs.Panel>
                            </Tabs>


                        </ScrollArea>
                    </div>
                </Container>
            </div>

            {/* <Footer /> */}

        </Fragment>

    );
}

export default NotificationTemplate;
