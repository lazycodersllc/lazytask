import React from 'react'

const authRoute = [
    {
        key: 'signIn',
        path: `/lazy-login`,
        component: React.lazy(() => import('../../components/Login')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: React.lazy(() => import('../../components/Profile/ResetPassword')),
        authority: [],
    },
]

export default authRoute
