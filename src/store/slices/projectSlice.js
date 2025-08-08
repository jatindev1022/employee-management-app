import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    projects: [],
  };

  const projectSlice = createSlice({
    name:'project',
    initialState,
    reducers: {
        addProject:(state,action)=>{
            state.projects.push(action.payload);

        },
        setProjects:(state,action)=>{
            state.projects=action.payload;
        }
    }
  });

  export const{addProject,setProjects}=projectSlice.actions;
  export default projectSlice.reducer;