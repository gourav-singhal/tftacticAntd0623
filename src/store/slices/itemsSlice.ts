import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";
import itemsService from "services/itemsService";

export const getItemsData = createAsyncThunk(
  "api/getItemsData",
  async () => {
    try {
      const data = await itemsService.getAllItems();
      return data;
    } catch (error) {
      console.log("Fetch error", error);
    }
  }
);

interface CounterState {
  data: DocumentData[] | undefined,
  isLoadingItems: boolean,
  isSuccessItems: boolean,
}

// Define the initial state using that type
const initialState: CounterState = {
  data: [],
  isLoadingItems: false,
  isSuccessItems: false,
}

const itemsSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItemsData.pending, (state) => {
        state.isLoadingItems = true;
      })
      .addCase(getItemsData.fulfilled, (state, { payload }) => {
        state.isLoadingItems = false;
        state.data = payload;
        state.isSuccessItems = true;
      })
      .addCase(getItemsData.rejected, (state) => {
        state.isLoadingItems = false;
        state.isSuccessItems = false;
      })
  },
});

export default itemsSlice.reducer;
