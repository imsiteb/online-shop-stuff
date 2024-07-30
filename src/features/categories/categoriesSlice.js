import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../utils/consts";
import axios from "axios";

export const getCategories = createAsyncThunk('categories/getCategories',
  async (_, thunkApi) => {
    try {
      const res = await axios(`${BASE_URL}/categories`);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkApi.rejectWithValue(err);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    list: [],
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
  }
});

export default categoriesSlice.reducer;