import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import {onSignInSuccess, onSignOutSuccess, setLoggedInUser, setToken} from "../store/auth/sessionSlice";
import {initialState, setUser} from "../store/auth/userSlice";
import appConfig from "../configs/app.config";
import {apiForgotPassword, apiSignIn, apiSignOut} from "../services/AuthService";
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";
import {REDIRECT_URL_KEY} from "../constants/app.constant";

function useAuth() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useSelector((state) => state.auth.session)

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values)
            if (resp) {
                const { token } = resp
                if(token){
                    dispatch(onSignInSuccess(token))
                    dispatch(setToken(token))
                    const decode_token = jwtDecode(token)
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
                        navigate(appConfig.authenticatedEntryPath)
                        return {
                            status: 'success',
                            message: 'Login successful',
                        }
                    }
                }
                navigate(appConfig.unAuthenticatedEntryPath)
                return {
                    status: 'error',
                    message: 'Something went wrong',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    const forgetPassword = async (values) => {
        try {
            const resp = await apiForgotPassword(values)
            if (resp) {
                return resp;
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    /*const signUp = async (values) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(onSignInSuccess(token))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                username: 'Anonymous',
                                authority: ['USER'],
                                email: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }*/

    const handleSignOut = () => {
        dispatch(onSignOutSuccess())
        dispatch(setUser(initialState))
        dispatch(setToken(''))
        dispatch(setLoggedInUser({}))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
        Cookies.remove('user_id');
    }

    return {
        authenticated: token && signedIn,
        signIn,
        // signUp,
        signOut,
        forgetPassword,
    }
}

export default useAuth
