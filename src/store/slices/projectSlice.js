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
  

  export const saveProjectAsync = createAsyncThunk(
    "project/saveProject",

    async (projectData, { rejectWithValue }) => {
      try {
        console.log("📡 Sending project data to backend:", projectData); // <-- debug
        const res = await fetch("/api/project", {
          method: "POST", // always POST, backend decides create/update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
  
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || "Save failed");
  
        return resData.data; // backend returns { success, data }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  
  export const deleteProjectAsync = createAsyncThunk(
    "project/deleteProject",
    async (projectId, { rejectWithValue }) => {
      try {
        const res = await fetch(`/api/project?_id=${projectId}`, {
          method: 'DELETE'
        });
  
        const resData = await res.json();
  
        if (!res.ok) throw new Error(resData.message || 'Failed to delete project');
  
        return projectId; // return deleted project id
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  




  const projectSlice = createSlice({
    name: "project",
    initialState: {
      projects: [],
      currentProject: null,
      loading: false,
      error: null,
    },
    reducers: {
      addProject: (state, action) => {
        state.projects.push(action.payload);
      },
      setProjects: (state, action) => {
        state.projects = action.payload;
      },
      updateProject: (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
      },
      deleteProject: (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload);
      },

      setCurrentProject: (state, action) => {
        state.currentProject = action.payload;
      },
      clearCurrentProject: (state) => { 
        state.currentProject = null;
      }

    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProjects.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
          state.loading = false;
          state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        .addCase(saveProjectAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(saveProjectAsync.fulfilled, (state, action) => {
          const index = state.projects.findIndex(p => p._id === action.payload._id);
          if (index !== -1) {
            state.projects[index] = { ...state.projects[index], ...action.payload };
          } else {
            state.projects.push(action.payload);
          }
          state.loading = false;
        })
        .addCase(saveProjectAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Add cases for deleteProjectAsync
        .addCase(deleteProjectAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteProjectAsync.fulfilled, (state, action) => {
          state.projects = state.projects.filter(p => p._id !== action.payload);
          state.loading = false;
        })
        .addCase(deleteProjectAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export const { addProject, setProjects, updateProject,   setCurrentProject,
    clearCurrentProject } = projectSlice.actions;
  export default projectSlice.reducer;

  