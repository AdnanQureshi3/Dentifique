import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    selectedPost:null,
    trendingPosts:[]
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost:(state, action) =>{
      state.selectedPost = action.payload;
    } ,
    setTrendingPosts: (state, action) => {
      state.trendingPosts = action.payload;
    }
  },
});

export const { setPosts  , setSelectedPost , setTrendingPosts} = postSlice.actions;
export default postSlice.reducer;
