// src/reducers/workspaceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkspace(state, action) {
            const payloadIds = new Set(action.payload.map((item) => item.id));
            return [
                ...state.filter((item) => !payloadIds.has(item.id)),
                ...action.payload
            ];
        },
        addWorkspace(state, action) {
            state.push(action.payload);
        },
        updateWorkspaceUsers(state, action) {
            const { workspaceId, userIds } = action.payload;
            const workspace = state.find((workspace) => workspace.id === workspaceId);
            if (workspace) {
                workspace.workspaceusers = userIds;
            }
        },
    },
});

export const { setWorkspace, addWorkspace, updateWorkspaceUsers } = workspaceSlice.actions;
export default workspaceSlice.reducer;
