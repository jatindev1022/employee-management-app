import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export  const fetchTasksByProject = createAsyncThunk(
    "tasks/fetchByProject",
    async (projectId, { rejectWithValue }) =>{
        try {
            const res = await fetch(`/api/task?projectId=${projectId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
            return data; // Expecting array of tasks
          } catch (err) {
            return rejectWithValue(err.message);
          }
    }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status }) // only send id + status
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || `HTTP error ${response.status}`);
      }

      return data.data; // updated task
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);




const taskSlice=createSlice({
    name:"tasks",
    initialState:{
        items: [],
        loading: false,
        error: null,    
        updating: false,
    },

    reducers:{
        addTask:(state,action)=>{
            state.action.push (action.payload);
        },
        updateTask:(state,action)=>{
            const index=state.items.findIndex(t=>t._id===payload._id);
            if (index !== -1) state.items[index] = action.payload;
        },
        deleteTask(state, action) {
            state.items = state.items.filter(t => t._id !== action.payload);
          },

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchTasksByProject.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTasksByProject.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchTasksByProject.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(updateTaskStatus.pending, (state) => {
          state.updating = true;
          state.error = null;
        })
        .addCase(updateTaskStatus.fulfilled, (state, action) => {
          state.updating = false;
          // Update the task in the items array
          const taskIndex = state.items.findIndex(task => task._id === action.payload._id);
          if (taskIndex !== -1) {
            state.items[taskIndex] = action.payload;
          }
        })
        .addCase(updateTaskStatus.rejected, (state, action) => {
          state.updating = false;
          state.error = action.payload;
        });


    }
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;