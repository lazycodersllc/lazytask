// src/reducers/workspaceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTask(state, action) {
      if (Array.isArray(action.payload)) {
        const payloadIds = new Set(action.payload.map(item => item.id));
        return [
          ...state.filter(item => !payloadIds.has(item.id)),
          ...action.payload
        ];
      } else if (typeof action.payload === 'object') {
        // If payload is an object, simply return it as the new state
        return action.payload;
      } else {
        console.error('Payload is not an array or object:', action.payload);
        // Handle the error appropriately, e.g., return the current state
        return state;
      }
    },
  },
});

export const { setTask } = taskSlice.actions;
export default taskSlice.reducer;
