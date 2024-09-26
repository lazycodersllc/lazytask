import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    addNotificationTemplate, deleteNotificationTemplate, editNotificationTemplate, getNotificationActions,
    getNotificationChannels,
    getNotificationTemplates, showNotificationTemplate
} from "../../../services/NotificationService";

//fetchNotificationActions
export const fetchNotificationActions = createAsyncThunk(
    'notificationTemplates/fetchNotificationActions',
    async () => {
        return getNotificationActions()
    }
)

// fetchAllNotificationChannels
export const fetchAllNotificationChannels = createAsyncThunk(
    'notificationTemplates/fetchAllNotificationChannels',
    async () => {
        return getNotificationChannels()
    }
)

export const fetchAllNotificationTemplates = createAsyncThunk(
    'notificationTemplates/fetchAllNotificationTemplate',
    async () => {
        return getNotificationTemplates()
    }
)
//createNotificationTemplate
export const createNotificationTemplate = createAsyncThunk(
    'notificationTemplates/createNotificationTemplate',
    async (data) => {
        return addNotificationTemplate(data)
    }
    )
//fetchNotificationTemplate by id
export const fetchNotificationTemplate = createAsyncThunk(
    'notificationTemplates/fetchNotificationTemplate',
    async (id) => {
        return showNotificationTemplate(id)
    }
)

// updateNotificationTemplate by id
export const updateNotificationTemplate = createAsyncThunk(
    'notificationTemplates/updateNotificationTemplate',
    async ( { id, data } ) => {
        return editNotificationTemplate(id, data)
    }
)

//remove notification template
export const removeNotificationTemplate = createAsyncThunk(
    'notificationTemplates/removeNotificationTemplate',
    async (id) => {
        return deleteNotificationTemplate(id)

    }
)

const initialState = {
    notificationActions: [],
    notificationTemplates: [],
    notificationChannels: [],
    notificationTemplate:{},
    isLoading: false,
    isError: false,
    error: '',
    success: null,
}

const notificationTemplateSlice = createSlice({
    name: 'notificationTemplate',
    initialState,
    reducers: {
        removeSuccessMessage: (state) => {
            state.success = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificationActions.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(fetchNotificationActions.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.notificationActions = action.payload.data
            })
            .addCase(fetchNotificationActions.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(fetchAllNotificationChannels.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(fetchAllNotificationChannels.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.notificationChannels = action.payload.data
            })
            .addCase(fetchAllNotificationChannels.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(fetchAllNotificationTemplates.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(fetchAllNotificationTemplates.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.notificationTemplates = action.payload.data
            })
            .addCase(fetchAllNotificationTemplates.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(createNotificationTemplate.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(createNotificationTemplate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.success = action.payload.message
                state.notificationTemplates.push(action.payload.data)
            })
            .addCase(createNotificationTemplate.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(fetchNotificationTemplate.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(fetchNotificationTemplate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.notificationTemplate = action.payload.data
            })
            .addCase(fetchNotificationTemplate.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(updateNotificationTemplate.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(updateNotificationTemplate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.success = action.payload.message
                state.notificationTemplates = state.notificationTemplates.map((template) => {
                    if (template.id === action.payload.data.id) {
                        return { ...action.payload.data }
                    }
                    return { ...template }
                }
                )
            })
            .addCase(updateNotificationTemplate.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })
            .addCase(removeNotificationTemplate.pending, (state) => {
                state.isLoading = true
                state.isError = false
            })
            .addCase(removeNotificationTemplate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.success = action.payload.message
                state.notificationTemplates = state.notificationTemplates.filter((template) => template.id !== action.payload.data.id)
            })
            .addCase(removeNotificationTemplate.rejected, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.error = action.error?.message
            })

    },
})
export const {
    removeSuccessMessage
} = notificationTemplateSlice.actions
export default notificationTemplateSlice.reducer
