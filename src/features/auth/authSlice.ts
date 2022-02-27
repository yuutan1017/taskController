import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from "axios";
import { AUTH_STATE,CRED,LOGIN_USER,POST_PROFILE,PROFILE,JWT,USER } from '../types';


const initialState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
});

export const { } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
