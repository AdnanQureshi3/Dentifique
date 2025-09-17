import React, { useEffect, useState } from "react";
import { useParams , Link } from "react-router-dom";
import axios from "axios";
import {useGitHubRepo } from '../Hooks/getGithubData'

function ProjectShow() {
  const { projectname } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function getProject() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/project/${projectname}`,
          { withCredentials: true }
        );
        if (res.data.success) setProject(res.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }
    getProject();
  }, [projectname]);

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
    return <div className="flex h-screen items-center justify-center">Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">{project.title}</h1>

        {/* Creator, Likes, Contribute */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <span>Created by</span>
            <img
              src={project.createdBy?.profilePicture }
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{project.createdBy?.username || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              <i className="fas fa-star"></i> {project.likes.length}
            </button>
            <a href={project.repoLink} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <i className="fas fa-user-plus"></i> Contribute
            </a>
          </div>
        </div>

        {/* Domain */}
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

</div>


        </div>

        {/* Tools */}
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-tools text-blue-500"></i> Tools & Tech
          </h2>
          <p className="text-gray-600">{project.tools.length > 0 ? project.tools.join(", ") : "N/A"}</p>
        </div>

        {/* Contributors */}
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-users text-blue-500"></i> Contributors
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.members.length > 0 ? (
              project.members.map((m) => (
                <div key={m._id} className="flex items-center bg-gray-100 px-3 py-1 rounded-full gap-2">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    {m.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{m.username}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No contributors</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600">{project.description || "No description available"}</p>
        </div>
         <div>
      <h1>{project?.title}</h1>
      <p>Stars: {repoData?.stargazers_count}</p>
      <p>Forks: {repoData?.forks_count}</p>
      <p>Contributors: {contributors?.length}</p>
      <p>Commits: {commits?.length}</p>
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
