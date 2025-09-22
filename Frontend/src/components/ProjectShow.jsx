import React, { use, useEffect, useState } from "react";
import { useParams , Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {useGitHubRepo } from '../Hooks/getGithubData'
import { useSelector } from "react-redux";
import { Delete } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Share2, Send, ExternalLink } from "lucide-react";


function ProjectShow() {
  const { projectname } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    async function getProject() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/project/${projectname}`,
          { withCredentials: true }
        );
        if (res.data.success) setProject(res.data.project);
        console.log(res.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }
    getProject();
  }, [projectname]);
  const LikeHandler = async (like) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/project/like/${project?._id}`, { withCredentials: true }); 
      if (res.data.success) {
        // Update the project state with the new like count
        if (like) {
          setProject((prev) => ({ ...prev, likes: prev.likes + 1 }));
          toast.success("Project liked!");
        } else {
          setProject((prev) => ({ ...prev, likes: prev.likes - 1 }));
          toast.success("Project unliked!");
        }
      }
    } catch (err) {
      console.error("Error liking project:", err);
      toast.error(err.response?.data?.msg );
    }
  };
  const DeleteHandler = async()=>{
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/project/delete/${project?._id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Project deleted successfully");
        // Redirect or update UI after deletion
        navigate(-1);
      }
    }catch(err){
      console.error("Error deleting project:", err);
      toast.error(err.response?.data?.msg);
    }
  };

  const { repoData, contributors, commits, error } = useGitHubRepo(project?.repoLink);

  function convertYouTubeLink(link) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
    const match = link.match(regex);
    return match && match[1]
      ? `https://www.youtube.com/embed/${match[1]}`
      : link;
  }

  if (loading)
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!project)
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white px-8 py-6 shadow-lg border border-gray-200 text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No such project found
        </h2>
        <p className="text-gray-600 mb-4">
          The project you’re looking for might have been deleted, moved, or never existed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        {/* Title */}
        <div className="text-3xl font-bold flex justify-between text-gray-800 border-b pb-2">
        <h1 className="">{project.title}</h1>
        {
          project.createdBy._id === user?._id &&
        <button 
  onClick={DeleteHandler} 
  className="p-2 rounded cursor-pointer hover:bg-red-100 text-red-600"
>
  <Trash2 size={24} />
</button>

        }
        </div>

        {/* Creator, Likes, Contribute */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <span>Created by</span>
            <img
  onClick={() => navigate(`/profile/${project.createdBy?._id}`)}
  src={project.createdBy?.profilePicture}
  alt="User"
  className="w-12 h-12 rounded-full cursor-pointer border-2 border-green-600 object-cover hover:w-14 hover:h-14 transition-all duration-200"
/>

            <span onClick={() => navigate(`/profile/${project.createdBy?._id}`)}
             className="font-medium hover:underline cursor-pointer hover:text-xl transition-all">{project.createdBy?.username || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={()=>LikeHandler(true)}
            className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              <i className="fas fa-star"></i> {project?.likes?.length || 0} Stars
            </button>
            <a href={project.repoLink} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <i className="fas fa-user-plus"></i> Contribute
            </a>
          </div>
        </div>

      
        <div className="text-gray-700">
          <span className="font-semibold">Domain: </span>
          <span>{project.domain || "N/A"}</span>
        </div>

        {/* Left Right Sections */}
        <div className="flex flex-row w-full gap-6 justify-between">
          {/* Left - Demo Video */}
        
            <div className="bg-gray-100 w-[70%] rounded-lg overflow-hidden">
              {project.demoLink ? (
                <iframe
                  className="w-full h-64"
                  src={convertYouTubeLink(project.demoLink)}
                  title="Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="p-6 text-center text-gray-500">No Demo Available</div>
              )}
            </div>
          

          {/* Right - Links */}
<div className="flex flex-col gap-4 w-[25%]">

  {/* Live */}
  <div className="flex gap-2">
    {project.liveLink ? (
      <a
        href={project.liveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        <i className="fas fa-globe"></i> Live
      </a>
    ) : (
      <span className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded cursor-not-allowed">
        <i className="fas fa-globe"></i> Live
      </span>
    )}
    <button
      onClick={() => navigator.clipboard.writeText(project.liveLink)}
      className={`px-3 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ${
        !project?.liveLink ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      title="Copy Live Link"
      disabled={!project?.liveLink}
    >
      <i className="fas fa-copy"></i>
    </button>
  </div>

  {/* Repo */}
  <div className="flex gap-2">
    {project.repoLink ? (
      <a
        href={project.repoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
      >
        <i className="fab fa-github"></i> Repo
      </a>
    ) : (
      <span className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded cursor-not-allowed">
        <i className="fab fa-github"></i> Repo
      </span>
    )}
    <button
      onClick={() => navigator.clipboard.writeText(project?.repoLink)}
      className={`px-3 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ${
        !project?.repoLink ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      title="Copy Repo Link"
      disabled={!project?.repoLink}
    >
      <i className="fas fa-copy"></i>
    </button>
  </div>

  {/* Demo */}
  <div className="flex gap-2">
    {project.demoLink ? (
      <a
        href={project.demoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded hover:bg-gray-900 transition"
      >
        <i className="fab fa-youtube"></i> Demo
      </a>
    ) : (
      <span className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded cursor-not-allowed">
        <i className="fab fa-youtube"></i> Demo
      </span>
    )}
    <button
      onClick={() => navigator.clipboard.writeText(project.demoLink)}
      className={`px-3 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ${
        !project?.demoLink ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      title="Copy Demo Link"
      disabled={!project?.demoLink}
    >
      <i className="fas fa-copy"></i>
    </button>
    
  </div>
  <div className="flex gap-2">
    
      <span
        onClick={()=>{navigate(`/project/public/${project.title.replace(/\s+/g, '-').toLowerCase()}`)}}
        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded hover:bg-gray-900 transition"
      >
        <Share2 size={20} /> Share
      </span>

      <button
        onClick={() => navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/project/public/${project.title.replace(/\s+/g, '-').toLowerCase()}`)}
      className={`px-3 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer`}
      title="Copy Project Link"
      
    >
      <i className="fas fa-copy"></i>
    </button>
  </div>

</div>


        </div>

        {/* Tools */}
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-tools text-blue-500"></i> Tools & Tech
          </h2>
          <p className="text-gray-600">{project.tools?.length > 0 ? project.tools.split(",").map((t)=>(
            <span> #{t}</span>
          )) : "N/A"}</p>
        </div>

        {/* Contributors */}
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-users text-blue-500"></i> Contributors (GitHub)
          </h2>
        <div className="flex flex-wrap gap-2">
  {contributors?.length > 0 ? (
    contributors.map((c) => (
      <div
        key={c?.url}
        className="relative cursor-pointer group flex items-center bg-gray-100 px-3 py-1 rounded-full gap-2 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-blue-200 text-blue-700 font-semibold rounded-full flex items-center justify-center uppercase">
          {c?.name.charAt(0)}
        </div>
        <span className="text-gray-900 text-sm">{c?.name}</span>
        <img src={c?.avatar} alt={c?.name} className="w-6 h-6 rounded-full object-cover" />

        {/* Hover link */}
        <a
          href={c?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
        >
          View GitHub
        </a>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-sm">No contributors</p>
  )}
</div>


        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600">{project.description || "No description available"}</p>
        </div>
        

      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
}

export default ProjectShow;
