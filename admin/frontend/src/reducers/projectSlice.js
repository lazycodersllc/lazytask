// src/reducers/workspaceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState =  [];


const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(state, action) {
        const payloadIds = new Set(action.payload.map(item => item.id));
        return [
            ...state.filter(item => !payloadIds.has(item.id)),
            ...action.payload
        ];
    },
    addProject(state, action) {
        state.push(action.payload);
    },
    updateProjectUsers(state, action) {
        const { projectId, userIds } = action.payload;
        const project = state.find((project) => project.id === projectId);
        if (project) {
            project.projectusers = userIds;
        }
    },
  },
});
 
export const { setProject, addProject, updateProjectUsers } = projectSlice.actions;
export default projectSlice.reducer;