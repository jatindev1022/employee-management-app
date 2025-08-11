import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";





export const fetchProjects = createAsyncThunk(
    "project/fetchProjects",
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch('/api/project'); // ✅ Added await
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch projects");
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  



  const projectSlice = createSlice({
    name: "project",
    initialState: {
      projects: [],
      loading: false,
      error: null,
    },
    reducers: {
      addProject: (state, action) => {
        state.projects.push(action.payload);
      },
      setProjects: (state, action) => {
        state.projects = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProjects.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => { // ✅ Added action
          state.loading = false;
          state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export const { addProject, setProjects } = projectSlice.actions;
  export default projectSlice.reducer;
  