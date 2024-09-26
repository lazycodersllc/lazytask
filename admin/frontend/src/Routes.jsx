import React, {useEffect, useMemo, useState} from 'react';
import {Routes, Route, HashRouter, useLocation, browserHistory} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile/Profile';
import ResetPassword from './components/Profile/ResetPassword';
import Settings from './components/Settings/Settings';
import Workspace from './components/Settings/Workspace';
import Projects from './components/Settings/Projects';
import ProjectDetails from './components/Elements/Project/ProjectDetails';
import {Provider, useDispatch} from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';
import ProfileEdit from "./components/Profile/ProfileEdit";
import Login from "./components/Login";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import MyTask from "./components/MyTask";
import NotificationTemplate from "./components/Notification/Template";
import {onSignInSuccess, setLoggedInUser, setToken} from "./store/auth/sessionSlice";
import {jwtDecode} from "jwt-decode";
import appConfig from "./configs/app.config";
import Cookies from "js-cookie";
import {setUser} from "./store/auth/userSlice";
import ForgetPassword from "./components/Profile/ForgetPassword";
import ChangePassword from "./components/Login/ChangePassword";
import Users from "./components/Settings/Users";
import PremiumRoute from "./route/PremiumRoute";
import Header from './components/Header';
import SettingMain from "./components/Settings/SettingMain";

// import License from "./view/license/License"

const AppRoutes = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        if(appLocalizer?.is_admin){
            if(appLocalizer.userResponse.data.token){
                const user_token = appLocalizer.userResponse.data.token
                dispatch(onSignInSuccess(user_token))
                dispatch(setToken(user_token))
                const decode_token = jwtDecode(user_token)
                if(decode_token.iss=== appConfig.liveSiteUrl){

                    const userData = decode_token.data;

                    const user = {
                        "authority" : userData.roles,
                        "loggedUserId" : userData.user_id,
                        "name" : userData.name,
                        "email" : userData.email,
                        "roles" : userData.roles,
                        "llc_roles" : userData.llc_roles,
                        "llc_permissions" : userData.llc_permissions,
                        "avatar" : userData.avatar
                    }
                    dispatch(setLoggedInUser(user || {}))
                    Cookies.set('user_id', userData.user_id);
                    dispatch(
                        setUser(
                            user || {
                                avatar: '',
                                loggedUserId : '',
                                name: '',
                                authority: [],
                                email: '',
                                roles : [],
                                llc_roles : [],
                                llc_permissions : [],
                            }
                        )
                    )
                }
            }

        }


    }, [dispatch]);

    const { signedIn, loggedInUser } = useSelector((state) => state.auth.session)

    const [premiumRoutes, setPremiumRoutes] = useState([]);
    document.addEventListener('DOMContentLoaded', function () {
            if (window.lazytaskPremium) {
                setPremiumRoutes(...premiumRoutes, window.lazytaskPremium.premiumAppRoutes);
            }
        }
    );
    return (
        <>
            <HashRouter>
                <Routes>
                    {/*<Route path="/" element={<ProtectedRoute authenticated={signedIn} />}>*/}
                    <Route path="/" element={<ProtectedWithHeader signedIn={signedIn}/>}>
                        {/*<Route path="/" element={<Dashboard />} />*/}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-task" element={<MyTask />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:id" element={<ProfileEdit />} />
                        <Route path="/resetpassword" element={<ResetPassword />} />
                        <Route path="/" element={<SettingMain />}>
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/workspace" element={<Workspace />} />
                            <Route path="/project" element={<Projects />} />
                            {premiumRoutes.length > 0 && premiumRoutes.map((route, index) => (
                                <Route
                                    key={route.key + index}
                                    path={route.path}
                                    element={
                                        <PremiumRoute
                                            routeKey={route.key}
                                            component={route.component}
                                            {...route.meta}
                                        />
                                    }
                                />
                            ))}
                        </Route>
                        <Route path="/project/task/list/:id" element={<ProjectDetails />} />
                        <Route path="/project/task/board/:id" element={<ProjectDetails />} />
                        <Route path="/project/task/calendar/:id" element={<ProjectDetails />} />
                        <Route path="/notification-template" element={<NotificationTemplate />} />
                    </Route>
                    <Route path="/" element={<PublicRoute authenticated={signedIn} />}>
                        <Route path="/" element={<Login />} />
                        <Route path="/lazy-login" element={<Login />} />
                        <Route path="/forget-password" element={<ForgetPassword />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                    </Route>

                    {/*<Route path="/project/project-details" element={<ProjectDetails />} />*/}
                    {/*<Route path="/project/project-board" element={<ProjectDetails />} />*/}
                </Routes>
            </HashRouter>
        </>
  );
};

function ProtectedWithHeader({ element, signedIn }) {
    return (
        <>
            <Header />
            <ProtectedRoute element={element} authenticated={signedIn} />
        </>
    );
}

export default AppRoutes;
