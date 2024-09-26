import React, {Fragment, useEffect} from 'react';
import {Container, Grid, ScrollArea, Tabs} from '@mantine/core';
import Header from '../Header';
import SettingsNav from './SettingsNav';
import GeneralSettings from "./Partial/GeneralSettings";
const Settings = () => {

  return (
    <Fragment>
        <ScrollArea className="h-[calc(100vh-230px)] pb-[2px]" scrollbarSize={4}>
            <Tabs color="orange" variant="outline" orientation="vertical" defaultValue="general-setting">
                <Tabs.List>
                    <Tabs.Tab value="general-setting" >
                        General Settings
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="general-setting" px={'md'}>
                    <GeneralSettings />
                </Tabs.Panel>
            </Tabs>

        </ScrollArea>
    </Fragment>
  );
};

export default Settings;
