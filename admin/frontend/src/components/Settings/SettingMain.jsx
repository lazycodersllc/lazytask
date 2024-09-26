import React, {Fragment, useEffect} from 'react';
import {Container, Grid, ScrollArea, Tabs} from '@mantine/core';
import {Navigate, Outlet, useLocation} from 'react-router-dom'
import Header from '../Header';
import SettingsNav from './SettingsNav';
import GeneralSettings from "./Partial/GeneralSettings";
const SettingMain = () => {

  return (
      <Fragment>
        {/*<Header />*/}
        <div className="dashboard">
          <Container size="full">
            <div className="settings-page-card bg-white rounded-xl p-6 pt-3 my-5 mb-0">
              <SettingsNav/>
              <Outlet />
            </div>
          </Container>
        </div>
      </Fragment>
  );
};

export default SettingMain;
