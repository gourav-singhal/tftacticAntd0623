import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import championsService from "services/championsService";

export const getChampionsData = createAsyncThunk(
  "api/getChampionsData",
  async () => {
    try {
      const data = await championsService.getAllChampions();
      return data;
    } catch (error) {
      console.log("Fetch error", error);
    }
  }
);

interface CounterState {
  data: DocumentData[] | undefined,
  isLoadingChampions: boolean,
  isSuccessChampions: boolean,
}

// Define the initial state using that type
const initialState: CounterState = {
  data: [],
  isLoadingChampions: false,
  isSuccessChampions: false,
}

const championsSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChampionsData.pending, (state) => {
        state.isLoadingChampions = true;
      })
      .addCase(getChampionsData.fulfilled, (state, { payload }) => {
        state.isLoadingChampions = false;
        state.data = payload;
        state.isSuccessChampions = true;
      })
      .addCase(getChampionsData.rejected, (state) => {
        state.isLoadingChampions = false;
        state.isSuccessChampions = false;
      })
  },
});

export default championsSlice.reducer;
