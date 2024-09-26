import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '../configs/app.config'

const { authenticatedEntryPath } = appConfig

const PublicRoute = ({authenticated}) => {

    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
