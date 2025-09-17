import React, { useState } from "react";
import { Clock, Rocket, PlusCircle } from "lucide-react";
import CreateProject from "./CreateProject";
import useGetAllProject from "../Hooks/getProject.jsx";
import { useSelector } from "react-redux";
import ProjectsCard from "./ProjectsCard";

function Projects() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [title , settitle ] = useState('');
  useGetAllProject({ page, limit  , title});
  const { projects } = useSelector((store) => store.project);

  if (showCreateForm) {
    return <CreateProject onClose={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="flex my-6 flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-6xl w-full border border-gray-200">
        
        {/* Top Controls Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Placeholder for Search & Filters */}
          <div className="flex gap-2 w-full md:w-auto">
            {/* Example placeholders */}
            <input
              type="text"
              placeholder="Search projects..."
              className="px-3 py-2 border rounded-md w-full md:w-64"
              onChange={(e) => {settitle(e.target.value)}}
              value={title}
            />
            <select className="px-3 py-2 border rounded-md">
              <option value="">Filter</option>
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {/* Create Project Button */}
        <button
  onClick={() => setShowCreateForm(true)}
  className="flex items-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md active:bg-indigo-800 active:scale-95 transition-all duration-150"
>
  <PlusCircle className="w-5 h-5" />
  Create Your Project
</button>

        </div>

        {projects.length === 0 ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Rocket className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              🚧 No Projects Yet
            </h1>
            <p className="text-gray-600 mb-6">
              Be the first one to{" "}
              <span className="font-semibold text-indigo-600">contribute</span>{" "}
              to the society. Share your project and inspire others!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              🚀 Community Projects
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {projects.map((project, index) => (
                <ProjectsCard onClick={() => naviga} key={index} project={project} />
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-center text-gray-500 text-sm gap-2 mt-6">
          <Clock className="w-4 h-4" />
          <span>Keep contributing to build the community</span>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center mt-6 space-y-2 text-sm">
          <div className="flex w-[90%] items-center justify-between space-x-2">
            <button
              className={`px-4 py-2 rounded-md bg-purple-700 text-white font-medium hover:bg-purple-800 transition ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 mt-1">
                {[...Array(page + 3)].map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-3 rounded-full ${
                      idx + 1 === page ? "bg-purple-700 scale-125" : "bg-gray-300"
                    } transition-all`}
                  ></span>
                ))}
              </div>
              <div className="text-gray-500 font-medium">Page {page}</div>
            </div>

            <button
              className={`px-4 py-2 rounded-md bg-purple-700 text-white font-medium hover:bg-purple-800 transition ${
                projects.length < limit ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={projects.length < limit}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Projects;
