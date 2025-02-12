import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../utils/consts";
import axios from "axios";

export const createUser = createAsyncThunk('users/createUser',
  async (payload, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const loginUser = createAsyncThunk('users/loginUser',
  async (payload, thunkApi) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, payload);
      const login = await axios(`${BASE_URL}/auth/profile`, {
        headers: {
          "Authorization": `Bearer ${res.data.access_token}`
        }
      })
      return login.data;
    } catch (err) {
      console.log(err);
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk('users/updateUser',
  async (payload, thunkApi) => {
    try {
      const res = await axios.put(`${BASE_URL}/users/${payload.id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkApi.rejectWithValue(err);
    }
  }
);

const addCurrentUser = (state, { payload }) => {
  state.currentUser = payload;
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    cart: [],
    favourites: [],
    isLoading: false,
    formType: "signup",
    showForm: false,
  },
  reducers: {
    addItemToCart: (state, { payload }) => {
      let newCart = [...state.cart];
      const found = state.cart.find(({ id }) => id == payload.id);
      if (found) {
        newCart = newCart.map((item) => {
          return item.id === payload.id ? { ...item, quantity: payload.quantity || item.quantity + 1 } : item;
        });
      }
      else newCart.push({ ...payload, quantity: 1 })
      state.cart = newCart;
    },
    addItemToFavourites: (state, { payload }) => {
      let newFavourites = [...state.favourites];
      const found = state.favourites.find(({ id }) => id == payload.id);
      if (found) {
        newFavourites = newFavourites.map((item) => {
          return item.id === payload.id ? { ...item, quantity: payload.quantity || item.quantity + 1 } : item;
        });
      }
      else newFavourites.push({ ...payload, quantity: 1 })
      state.favourites = newFavourites;
    },
    removeItemFromCart: (state, {payload}) => {
      state.cart = state.cart.filter(({id}) => id !== payload);
    },
    toggleForm: (state, { payload }) => {
      state.showForm = payload;
    },
    toggleFormType: (state, { payload }) => {
      state.formType = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, addCurrentUser);
    builder.addCase(loginUser.fulfilled, addCurrentUser);
    builder.addCase(updateUser.fulfilled, addCurrentUser);
  }
});

export const { addItemToCart, addItemToFavourites, toggleForm, toggleFormType, removeItemFromCart } = userSlice.actions;

export default userSlice.reducer;