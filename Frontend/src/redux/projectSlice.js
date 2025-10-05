import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    selectedProject:null,

  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setSelectedProject:(state, action) =>{
      state.selectedProject = action.payload;
    } ,

  },
});

export const { setProjects  , setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
