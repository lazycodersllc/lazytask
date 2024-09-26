import { combineReducers } from '@reduxjs/toolkit'
import commonReducer from './commonSlice'

const reducer = combineReducers({
    common: commonReducer,
})

export default reducer
