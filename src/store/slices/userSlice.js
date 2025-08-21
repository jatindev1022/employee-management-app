import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "autoprefixer";

export const fetchUsers=createAsyncThunk(
     "user/fetchUser"
     ,async (_, { rejectWithValue })=>{
        try{
          const res = await fetch('/api/users');
            const data=await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch user data");
            return data;
      
        } 
        catch (error) {
            return rejectWithValue(error.message);
        }
        
     }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users?_id=${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch user data");

      if (!data || data.length === 0) throw new Error("User not found");

      return data[0]; // first user from array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);





const userSlice=createSlice({
  name:"user",
  initialState:{
    data:null,
    users: [], 
    loading:false,
    error:null,
  },


  reducers:{
    setUser: (state, action) => {
        state.data = action.payload; // set logged-in user
      },

      clearUser: (state) => {
        state.data = null; // clear logged-in user
      },
      addUser: (state, action) => {
        state.users.push(action.payload); // add new user to list
      },
      setUsers:(state,action)=>{
        state.users = action.payload; // replace full list
      }
  },

  extraReducers: (builder) => {
    // For fetching logged-in user
    // builder
    //   .addCase(fetchUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchUser.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.data = action.payload;
    //   })
    //   .addCase(fetchUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

    // For fetching all users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },


});

export const { setUser, clearUser, addUser, setUsers } = userSlice.actions;
export default userSlice.reducer;