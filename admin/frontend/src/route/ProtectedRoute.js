import React, {useEffect, useState} from 'react'
import appConfig from '../configs/app.config'
import {Navigate, Outlet, useLocation} from 'react-router-dom'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = ({authenticated, children}) => {
    const location = useLocation();
    if(location.pathname === '/'){
        return <Navigate to={unAuthenticatedEntryPath} />
    }
    if (!authenticated) {
        return <Navigate to={`${unAuthenticatedEntryPath}`} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
