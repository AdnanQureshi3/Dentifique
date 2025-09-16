import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    selectedProject:null,
    trendingProjects:[]
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setSelectedProject:(state, action) =>{
      state.selectedProject = action.payload;
    } ,
    setTrendingProjects: (state, action) => {
      state.trendingProjects = action.payload;
    }
  },
});

export const { setProjects  , setSelectedProject , setTrendingProjects} = projectSlice.actions;
export default projectSlice.reducer;
