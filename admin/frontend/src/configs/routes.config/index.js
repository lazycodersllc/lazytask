import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: React.lazy(() => import('../../components/Dashboard')),
        authority: [],
    },
    {
        key: 'profile',
        path: '/profile',
        component: React.lazy(() => import('../../components/Profile/Profile')),
        authority: [],
    },
    {
        key: 'profile.edit',
        path: '/profile/:id',
        component: React.lazy(() => import('../../components/Profile/ProfileEdit')),
        authority: [],
    },
    {
        key: 'settings',
        path: '/settings',
        component: React.lazy(() => import('../../components/Settings/Settings')),
        authority: [],
    },
    {
        key: 'workspace',
        path: '/workspace',
        component: React.lazy(() =>
            import('../../components/Settings/Workspace')
        ),
        authority: [],
    },
    {
        key: 'project',
        path: '/project',
        component: React.lazy(() => import('../../components/Settings/Projects')),
        authority: [],
    },
    {
        key: 'project.task.list',
        path: '/project/task/list/:id',
        component: React.lazy(() =>
            import('../../components/Elements/Project/ProjectDetails')
        ),
        authority: [],
    },
    {
        key: 'project.task.board',
        path: '/project/task/board/:id',
        component: React.lazy(() => import('../../components/Elements/Project/ProjectDetails')),
        authority: [],
    }

]
