// src/reducers/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState =  [];
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
        const payloadIds = new Set(action.payload && action.payload.length > 0 && action.payload.map(item => item.id));
        return [
            ...state.filter(item => !payloadIds.has(item.id)),
            ...action.payload
        ];
    },
    
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
