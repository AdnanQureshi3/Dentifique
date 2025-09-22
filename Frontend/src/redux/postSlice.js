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
      console.log("EMPTY")
    },
     addPosts: (state, action) => {
       const existingIds = new Set(state.posts.map(p => p._id));
  const newPosts = action.payload.filter(p => !existingIds.has(p._id));
  state.posts = [...state.posts, ...newPosts];
    },
    setSelectedPost:(state, action) =>{
      state.selectedPost = action.payload;
    } ,
    setTrendingPosts: (state, action) => {
      state.trendingPosts = action.payload;
    }
  },
});

export const { setPosts , addPosts  , setSelectedPost , setTrendingPosts} = postSlice.actions;
export default postSlice.reducer;
