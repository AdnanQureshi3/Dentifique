import React from "react";
import { Star, Github, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProjectsCard({ project }) {
  const navigate = useNavigate(); 
  return (
    <div onClick={() => navigate(`/project/${project.title}`)}
     className="w-100 bg-white cursor-pointer shadow-md rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-105 hover:shadow-xl">

      <div className="h-28 w-full overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h2 className="text-md font-semibold text-indigo-700 truncate">{project.title}</h2>
        <p className="text-md text-gray-500 mt-1 truncate">By: {project.createdBy.username || "Anonymous"}</p>

        {/* Links */}
        <div className="flex items-center mt-2 space-x-3 text-sm">
          <a href={project.repoLink} target="_blank" className="flex items-center hover:text-indigo-600">
            <Github size={16} className="mr-1" /> Repo
          </a>
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" className="flex items-center hover:text-indigo-600">
              <Globe size={16} className="mr-1" /> Live
            </a>
          )}
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" className="flex items-center hover:text-indigo-600">
              Demo
            </a>
          )}
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap mt-2 text-xs text-gray-400">
          {project.domain && <span className="mr-2">#{project.domain}</span>}
          <br />
          
          <p className="text-gray-600">{project.tools?.length > 0 ? project.tools.split(",").map((t)=>(
            <span> #{t}</span>
          )) : "N/A"}</p>
        </div>
      </div>

      {/* Likes */}
      <div className="p-2 border-t flex items-center justify-end text-sm">
        <Star className="text-yellow-400 mr-1" size={16} />
        <span>{project.likes?.length || 0}</span>
      </div>
    </div>
  );
}

export default ProjectsCard;
