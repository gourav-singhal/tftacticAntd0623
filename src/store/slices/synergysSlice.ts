import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import synergysService from "services/synergysService";

export const getSynergysData = createAsyncThunk(
  "api/getSynergysData",
  async () => {
    try {
      const data = await synergysService.getAllSynergys();
      return data;
    } catch (error) {
      console.log("Fetch error", error);
    }
  }
);

interface CounterState {
  data: DocumentData[] | undefined,
  isLoadingSynergys: boolean,
  isSuccessSynergys: boolean,
}

// Define the initial state using that type
const initialState: CounterState = {
  data: [],
  isLoadingSynergys: false,
  isSuccessSynergys: false,
}

const synergysSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSynergysData.pending, (state) => {
        state.isLoadingSynergys = true;
      })
      .addCase(getSynergysData.fulfilled, (state, { payload }) => {
        state.isLoadingSynergys = false;
        state.data = payload;
        state.isSuccessSynergys = true;
      })
      .addCase(getSynergysData.rejected, (state) => {
        state.isLoadingSynergys = false;
        state.isSuccessSynergys = false;
      })
  },
});

export default synergysSlice.reducer;
