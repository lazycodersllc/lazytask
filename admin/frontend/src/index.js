// src/index.js
import React from 'react';
import { render } from '@wordpress/element';
import { MantineProvider, createTheme } from '@mantine/core';
import './style/main.scss';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import store, {persistor} from './store';
import App from './App';
import { Provider } from 'react-redux';
import {ModalsProvider} from "@mantine/modals";
import {PersistGate} from "redux-persist/integration/react";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const theme = createTheme({
    colorScheme: 'light',
    primaryColor: 'blue',
    errorColor: 'red',
    fontFamily: 'Open Sans, sans-serif',
    cursorType: 'pointer',
    headings: {
        fontFamily: 'Open Sans, sans-serif',
    },
    legend: {
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '16px',
    },

})

render(
  // <Provider withGlobalStyles withNormalizeCSS store={store}>
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider theme={theme}>
            <Notifications />
            <ModalsProvider>
                <App />
            </ModalsProvider>
        </MantineProvider>
      </PersistGate>
  </Provider>,
  document.getElementById('lazy_pms')
);