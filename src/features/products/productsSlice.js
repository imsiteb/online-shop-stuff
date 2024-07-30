import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../utils/consts";
import { shuffle } from "../../utils/common";
import axios from "axios";

export const getProducts = createAsyncThunk('products/getProducts',
  async (_, thunkApi) => {
    try {
      const res = await axios(`${BASE_URL}/products`);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkApi.rejectWithValue(err);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    filtered: [],
    related: [],
    isLoading: false,
  },
  reducers: {
    filterByPrice: (state, { payload }) => {
      state.filtered = state.list.filter(({ price }) => price < payload);
    },
    getRelatedProducts: (state, { payload }) => {
      const list = state.list.filter(({ category: { id } }) => id === payload);
      state.related = shuffle(list);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
  }
});

export const { filterByPrice, getRelatedProducts } = productsSlice.actions;

export default productsSlice.reducer;