import React, { use, useEffect } from "react";
import Post from "./Post";
import Article from "./Article.jsx";
import { useSelector , useDispatch } from "react-redux";
import useGetAllPost from "../Hooks/getAllPosts.jsx";
import { Loader2 } from "lucide-react";
import { setPosts } from "@/redux/postSlice";



function Posts() {
  const { posts } = useSelector((store) => store.post);
  const { fetchPosts, hasMore , loading } = useGetAllPost();

  return (
    <div>
      {posts.map((item) => {
        if (item.type === "post") {
          return <Post key={item._id} post={item} />;
        }
        if (item.type === "article") {
          return <Article key={item._id} post={item} />;
        }
        return null;
      })}

      {/* Load More button */}
  {hasMore && (
  <button
    disabled={loading}
    onClick={fetchPosts}
    className={`w-full py-3 mt-6 rounded-xl font-medium transition-all 
    ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading...
      </div>
    ) : (
      "Load More"
    )}
  </button>
)}

    </div>
  );
}

export default Posts;
