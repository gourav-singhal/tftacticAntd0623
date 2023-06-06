import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import teamcompsService from "services/teamcompsService";

export const getTeamCompsData = createAsyncThunk(
  "api/getTeamCompsData",
  async () => {
    try {
      const data = await teamcompsService.getAllTeamComps();
      return data;
    } catch (error) {
      console.log("Fetch error", error);
    }
  }
);

interface CounterState {
  data: DocumentData[] | undefined,
  isLoadingTeamComps: boolean,
  isSuccessTeamComps: boolean,
}

// Define the initial state using that type
const initialState: CounterState = {
  data: [],
  isLoadingTeamComps: false,
  isSuccessTeamComps: false,
}

const teamCompsSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeamCompsData.pending, (state) => {
        state.isLoadingTeamComps = true;
      })
      .addCase(getTeamCompsData.fulfilled, (state, { payload }) => {
        state.isLoadingTeamComps = false;
        state.data = payload;
        state.isSuccessTeamComps = true;
      })
      .addCase(getTeamCompsData.rejected, (state) => {
        state.isLoadingTeamComps = false;
        state.isSuccessTeamComps = false;
      })
  },
});

export default teamCompsSlice.reducer;
