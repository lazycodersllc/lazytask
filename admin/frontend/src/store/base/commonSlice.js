import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    currentRouteKey: '',
    inputFieldIsFocused: false,
}

export const commonSlice = createSlice({
    name: 'base/common',
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action) => {
            state.currentRouteKey = action.payload
        },
        updateInputFieldFocus: (state, action) => {
            state.inputFieldIsFocused = action.payload
        },
    },
})

export const {
    setCurrentRouteKey,
    updateInputFieldFocus,
} = commonSlice.actions

export default commonSlice.reducer
