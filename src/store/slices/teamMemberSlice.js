// teamSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/team-member");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch team members");
      return data; // e.g. { backend: [...], frontend: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teamMemberSlice = createSlice({
  name: "teamMemberSlice",
  initialState: {
    membersByTeam: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.membersByTeam = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamMemberSlice.reducer;
